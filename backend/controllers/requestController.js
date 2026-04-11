const pool = require('../db');

// @desc    Create a new blood request emergency
// @route   POST /api/requests
// @access  Private (Needs JWT)
const createRequest = async (req, res) => {
  const { patient_name, blood_type, hospital_name, contact_number, urgency, city } = req.body;
  
  // Pulled securely from the JWT token via your auth middleware
  const requester_id = req.user.id;

  try {
    const newRequestResult = await pool.query(
      `INSERT INTO blood_requests 
        (requester_id, patient_name, blood_type, hospital_name, contact_number, urgency, city, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [requester_id, patient_name, blood_type, hospital_name, contact_number, urgency || 'Medium', city || null, 'Open']
    );

    const newRequest = newRequestResult.rows[0];

    // Find nearby donors for this city and blood_type
    if (city && blood_type) {
      const donorsResult = await pool.query(
        `SELECT u.email FROM donors d 
         JOIN users u ON d.user_id = u.id 
         WHERE d.blood_type = $1 AND d.city = $2 AND d.status = 'eligible'`,
        [blood_type, city]
      );
      
      const donorEmails = donorsResult.rows.map(row => row.email);
      
      if (donorEmails.length > 0) {
        const { sendUrgentRequestEmail } = require('../utils/emailService');
        // Do this asynchronously to not block the request
        sendUrgentRequestEmail(donorEmails, blood_type, city, hospital_name, contact_number);
      }
    }

    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error saving emergency request' });
  }
};

// @desc    Get top 5 recent open blood requests
// @route   GET /api/requests
// @access  Public
const getOpenRequests = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM blood_requests WHERE status = 'Open' ORDER BY created_at DESC LIMIT 5"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error fetching blood requests' });
  }
};

module.exports = {
  createRequest,
  getOpenRequests
};
