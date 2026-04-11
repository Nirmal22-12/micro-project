const pool = require('../db');

// @desc    Add a new donor
// @route   POST /api/donors
// @access  Private
const createDonor = async (req, res) => {
  const { blood_type, last_donation_date, status, weight, phone_number, city, state, is_available, lat, lng } = req.body;

  // We get user_id from the decoded JWT token injected by our protect middleware
  const user_id = req.user.id;

  // Validate blood type
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!blood_type || !validBloodTypes.includes(blood_type)) {
    return res.status(400).json({ message: 'A valid blood type is required (A+, A-, B+, B-, AB+, AB-, O+, O-)' });
  }

  try {
    // Check if the user is already registered as a donor
    const existingDonor = await pool.query('SELECT * FROM donors WHERE user_id = $1', [user_id]);
    if (existingDonor.rows.length > 0) {
      return res.status(400).json({ message: 'You are already registered as a donor.' });
    }

    const newDonorResult = await pool.query(
      'INSERT INTO donors (user_id, blood_type, last_donation_date, status, weight, phone_number, city, state, is_available, lat, lng) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        user_id, 
        blood_type, 
        last_donation_date || null, 
        status || 'eligible', 
        weight || null, 
        phone_number || null, 
        city || null,
        state || null,
        is_available !== undefined ? is_available : true,
        lat || null,
        lng || null
      ]
    );

    res.status(201).json(newDonorResult.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error creating donor' });
  }
};

// @desc    Get all donors with optional filtering by blood_type
// @route   GET /api/donors
// @access  Public (or Private depending on your preferences)
const getDonors = async (req, res) => {
  const { blood_type } = req.query;

  try {
    let query = `
      SELECT d.*, u.name, u.email, u.avatar,
        CASE 
          WHEN d.last_donation_date IS NOT NULL AND d.last_donation_date >= CURRENT_DATE - INTERVAL '90 days' THEN 'recently_donated'
          ELSE COALESCE(d.availability_status, CASE WHEN d.is_available THEN 'available' ELSE 'busy' END)
        END AS "availabilityStatus",
        CASE 
          WHEN d.last_donation_date IS NOT NULL AND d.last_donation_date >= CURRENT_DATE - INTERVAL '90 days' THEN false
          ELSE (COALESCE(d.availability_status, CASE WHEN d.is_available THEN 'available' ELSE 'busy' END) = 'available')
        END AS "isAvailable"
      FROM donors d 
      JOIN users u ON d.user_id = u.id
    `;
    let queryParams = [];

    // Optional filtering by blood type (e.g. /api/donors?blood_type=A+)
    if (blood_type) {
      query += ' WHERE d.blood_type = $1';
      queryParams.push(blood_type);
    }

    query += ' ORDER BY d.id DESC';

    const donorsResult = await pool.query(query, queryParams);
    res.status(200).json(donorsResult.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error fetching donors' });
  }
};

// @desc    Search eligible donors by location, blood group, etc.
// @route   GET /api/donors/search
// @access  Public
const searchDonors = async (req, res) => {
  const { bloodGroup, city, state, lat, lng, radius, availability, lastDonated, sortBy, limit = 10, page = 1 } = req.query;

  try {
    let fromClause = ` FROM donors d JOIN users u ON d.user_id = u.id`;
    let whereClause = ` WHERE 1=1`;
    let orderClause = ``;
    // whereParams holds only params used in WHERE clause (used for count query too)
    let whereParams = [];
    let whereParamIndex = 1;

    // Availability
    if (availability === 'Available Now') {
      whereClause += ` AND d.is_available = true`;
    }

    // Last Donated Filter
    if (lastDonated === '3+ months ago') {
      whereClause += ` AND (d.last_donation_date <= CURRENT_DATE - INTERVAL '3 months' OR d.last_donation_date IS NULL)`;
    } else if (lastDonated === '6+ months ago') {
      whereClause += ` AND (d.last_donation_date <= CURRENT_DATE - INTERVAL '6 months' OR d.last_donation_date IS NULL)`;
    }

    // Blood Group
    if (bloodGroup && bloodGroup.toLowerCase() !== 'all') {
      whereClause += ` AND d.blood_type ILIKE $${whereParamIndex}`;
      whereParams.push(bloodGroup);
      whereParamIndex++;
    }

    // City
    if (city) {
      whereClause += ` AND d.city ILIKE $${whereParamIndex}`;
      whereParams.push(`%${city}%`);
      whereParamIndex++;
    }
    
    // State
    if (state && state !== 'All') {
      whereClause += ` AND d.state ILIKE $${whereParamIndex}`;
      whereParams.push(`%${state}%`);
      whereParamIndex++;
    }

    // Radius filter in WHERE (if lat/lng + radius provided)
    let usingLocation = false;
    if (lat && lng && radius) {
      whereClause += ` AND d.lat IS NOT NULL AND d.lng IS NOT NULL AND (6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians($${whereParamIndex})) * cos(radians(d.lat)) * cos(radians(d.lng) - radians($${whereParamIndex+1})) + sin(radians($${whereParamIndex})) * sin(radians(d.lat)))))) <= $${whereParamIndex+2}`;
      whereParams.push(parseFloat(lat), parseFloat(lng), parseFloat(radius));
      whereParamIndex += 3;
      usingLocation = true;
    }

    // --- Count query uses only WHERE params (no distance SELECT, no LIMIT/OFFSET) ---
    const countQuery = `SELECT COUNT(*)` + fromClause + whereClause;
    const countParams = [...whereParams];

    // --- Now build the full data query with distance SELECT and pagination ---
    let dataParamIndex = whereParamIndex; // continue after where params
    let selectClause = `
      SELECT 
        d.id,
        u.name, u.avatar,
        d.blood_type AS "bloodGroup", 
        d.city, 
        d.state, 
        NULL AS phone,
        CASE 
          WHEN d.last_donation_date IS NOT NULL AND d.last_donation_date >= CURRENT_DATE - INTERVAL '90 days' THEN 'recently_donated'
          ELSE COALESCE(d.availability_status, CASE WHEN d.is_available THEN 'available' ELSE 'busy' END)
        END AS "availabilityStatus",
        CASE 
          WHEN d.last_donation_date IS NOT NULL AND d.last_donation_date >= CURRENT_DATE - INTERVAL '90 days' THEN false
          ELSE (COALESCE(d.availability_status, CASE WHEN d.is_available THEN 'available' ELSE 'busy' END) = 'available')
        END AS "isAvailable",
        d.last_donation_date AS "lastDonated"
    `;

    let dataParams = [...whereParams]; // start with where params

    // Distance in SELECT (only for display, not filtering)
    if (lat && lng && !radius) {
      usingLocation = true;
      selectClause += `, 
        CASE WHEN d.lat IS NULL OR d.lng IS NULL THEN NULL 
             ELSE (6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians($${dataParamIndex})) * cos(radians(d.lat)) * cos(radians(d.lng) - radians($${dataParamIndex+1})) + sin(radians($${dataParamIndex})) * sin(radians(d.lat)))))) 
        END AS distance`;
      dataParams.push(parseFloat(lat), parseFloat(lng));
      dataParamIndex += 2;
    } else if (lat && lng && radius) {
      // Distance already in WHERE, but also add to SELECT for display
      // Reuse the same param indices from WHERE clause for lat/lng
      const latParam = whereParamIndex - 3;
      const lngParam = whereParamIndex - 2;
      selectClause += `, 
        CASE WHEN d.lat IS NULL OR d.lng IS NULL THEN NULL 
             ELSE (6371 * acos(GREATEST(-1.0, LEAST(1.0, cos(radians($${latParam})) * cos(radians(d.lat)) * cos(radians(d.lng) - radians($${lngParam})) + sin(radians($${latParam})) * sin(radians(d.lat))))))
        END AS distance`;
      // No new params needed — reusing WHERE params
    }

    if (sortBy === 'Nearest' && usingLocation) {
        orderClause = ` ORDER BY distance ASC`;
    } else if (sortBy === 'Name A-Z') {
        orderClause = ` ORDER BY u.name ASC`;
    } else {
        orderClause = ` ORDER BY d.id DESC`;
    }

    // Pagination
    const numLimit = parseInt(limit, 10);
    const numPage = parseInt(page, 10);
    const offset = (numPage - 1) * numLimit;
    const paginationClause = ` LIMIT $${dataParamIndex} OFFSET $${dataParamIndex+1}`;
    dataParams.push(numLimit, offset);

    const fullQuery = selectClause + fromClause + whereClause + orderClause + paginationClause;

    console.log("Full Query:", fullQuery);
    console.log("Data Params:", dataParams);
    console.log("Count Query:", countQuery);
    console.log("Count Params:", countParams);

    const [{ rows: dataRows }, { rows: countRows }] = await Promise.all([
      pool.query(fullQuery, dataParams),
      pool.query(countQuery, countParams)
    ]);

    const total = parseInt(countRows[0].count, 10);

    res.status(200).json({
      donors: dataRows,
      totalPages: Math.ceil(total / numLimit),
      currentPage: numPage,
      totalDonors: total
    });
  } catch (error) {
    console.error("searchDonors error:", error);
    res.status(500).json({ message: 'Server error searching donors', error: error.message, stack: error.stack });
  }
};

// @desc    Get donor suggestions (cities)
// @route   GET /api/donors/search/suggestions
// @access  Public
const getDonorSuggestions = async (req, res) => {
  const { city } = req.query;
  try {
     let query = `SELECT DISTINCT city FROM donors WHERE city IS NOT NULL`;
     let params = [];
     if (city) {
         query += ` AND city ILIKE $1`;
         params.push(`%${city}%`);
     }
     query += ` LIMIT 10`;
     const result = await pool.query(query, params);
     const suggestions = result.rows.map(row => row.city);
     res.status(200).json(suggestions);
  } catch (error) {
     console.error(error.message);
     res.status(500).json({ message: 'Server error fetching suggestions' });
  }
};

const getDonorById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT d.id, d.user_id, d.blood_type, d.last_donation_date, d.status, d.weight, d.city, d.state, d.is_available, u.name, u.email, u.avatar,
        CASE 
          WHEN d.last_donation_date IS NOT NULL AND d.last_donation_date >= CURRENT_DATE - INTERVAL '90 days' THEN 'recently_donated'
          ELSE COALESCE(d.availability_status, CASE WHEN d.is_available THEN 'available' ELSE 'busy' END)
        END AS "availabilityStatus",
        CASE 
          WHEN d.last_donation_date IS NOT NULL AND d.last_donation_date >= CURRENT_DATE - INTERVAL '90 days' THEN false
          ELSE (COALESCE(d.availability_status, CASE WHEN d.is_available THEN 'available' ELSE 'busy' END) = 'available')
        END AS "isAvailable"
      FROM donors d 
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Donor not found' });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const requestDonation = async (req, res) => {
  try {
    const donorId = req.params.id;
    const requestorId = req.user.id;

    // Fetch requestor
    const reqRes = await pool.query('SELECT name, email FROM users WHERE id = $1', [requestorId]);
    const requestor = reqRes.rows[0];

    // Fetch donor
    const donRes = await pool.query(`SELECT u.name, u.email FROM donors d JOIN users u ON d.user_id = u.id WHERE d.id = $1`, [donorId]);
    if (donRes.rows.length === 0) return res.status(404).json({ message: 'Donor not found' });
    const donor = donRes.rows[0];

    const { sendDonationRequestEmail } = require('../utils/emailService');
    await sendDonationRequestEmail(donor.email, donor.name, requestor.name, requestor.email);

    res.status(200).json({ message: 'Request sent successfully via email!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error triggering donation request' });
  }
};

const callDonor = async (req, res) => {
  try {
    const donorId = req.params.id;
    const requestorId = req.user.id;

    // We shouldn't allow the user to call themselves for no reason, but maybe it's fine.
    
    // Fetch requestor phone
    // We check if the requestor has a phone in donors table, as that's where we store it, 
    // or maybe the users table? In this app, users don't have phone, donors do. 
    // But they could have updated their profile in users/donors. 
    // Let's check the donors table for the requestor's phone number.
    const reqRes = await pool.query('SELECT phone_number FROM donors WHERE user_id = $1', [requestorId]);
    if (reqRes.rows.length === 0 || !reqRes.rows[0].phone_number) {
      return res.status(400).json({ message: 'You must register as a donor and provide a phone number in your profile before calling.' });
    }
    const callerPhone = reqRes.rows[0].phone_number;

    // Fetch donor
    const donRes = await pool.query(`SELECT d.phone_number FROM donors d WHERE d.id = $1`, [donorId]);
    if (donRes.rows.length === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    const donorPhone = donRes.rows[0].phone_number;
    
    if (!donorPhone) {
      return res.status(400).json({ message: 'This donor has not provided a phone number.' });
    }

    // Rate limiting / Cooldown check could be added here querying a 'call_logs' table, 
    // but without db migration, we'll keep it simple or implement a basic in-memory map for the demo.
    
    const { initiateMaskedCall } = require('../utils/twilioService');
    const callStatus = await initiateMaskedCall(callerPhone, donorPhone);

    res.status(200).json({ message: 'Call initiated successfully.', status: callStatus.status });
  } catch (error) {
    console.error("callDonor error:", error.message);
    res.status(500).json({ message: 'Server error triggering masked call' });
  }
};

  // @desc    Update donor availability status (manual)
  // @route   PATCH /api/donor/status
  // @access  Private (donor only)
  const updateDonorStatus = async (req, res) => {
    try {
      const user_id = req.user.id;
      const { availabilityStatus } = req.body;

      if (!['available', 'busy'].includes(availabilityStatus)) {
        return res.status(400).json({ message: 'Invalid availability status. Use "available" or "busy".' });
      }

      const updateRes = await pool.query(
        'UPDATE donors SET availability_status = $1 WHERE user_id = $2 RETURNING id',
        [availabilityStatus, user_id]
      );

      if (updateRes.rows.length === 0) return res.status(404).json({ message: 'Donor profile not found' });

      // Return fresh donor record with computed availability fields
      const query = `
        SELECT d.id, d.user_id, d.blood_type, d.last_donation_date, d.status, d.weight, d.city, d.state, d.is_available, u.name, u.email, u.avatar,
          CASE 
            WHEN d.last_donation_date IS NOT NULL AND d.last_donation_date >= CURRENT_DATE - INTERVAL '90 days' THEN 'recently_donated'
            ELSE COALESCE(d.availability_status, CASE WHEN d.is_available THEN 'available' ELSE 'busy' END)
          END AS "availabilityStatus",
          CASE 
            WHEN d.last_donation_date IS NOT NULL AND d.last_donation_date >= CURRENT_DATE - INTERVAL '90 days' THEN false
            ELSE (COALESCE(d.availability_status, CASE WHEN d.is_available THEN 'available' ELSE 'busy' END) = 'available')
          END AS "isAvailable"
        FROM donors d JOIN users u ON d.user_id = u.id WHERE d.user_id = $1
      `;

      const fresh = await pool.query(query, [user_id]);
      res.status(200).json(fresh.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error updating availability' });
    }
  };

module.exports = {
  createDonor,
  getDonors,
  searchDonors,
  getDonorSuggestions,
  getDonorById,
  requestDonation,
  callDonor,
  updateDonorStatus
};
