const pool = require('../db');

// @desc    Get all donations for the logged-in donor
// @route   GET /api/donations
// @access  Private
const getMyDonations = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT dn.id, dn.donation_type, dn.donation_date, dn.location, dn.notes, dn.created_at
       FROM donations dn
       JOIN donors d ON dn.donor_id = d.id
       WHERE d.user_id = $1
       ORDER BY dn.donation_date DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error fetching donations' });
  }
};

// @desc    Add a new donation record
// @route   POST /api/donations
// @access  Private
const addDonation = async (req, res) => {
  const userId = req.user.id;
  const { donation_type, donation_date, location, notes } = req.body;

  try {
    // Get donor id
    const donorRes = await pool.query('SELECT id FROM donors WHERE user_id = $1', [userId]);
    if (donorRes.rows.length === 0) {
      return res.status(400).json({ message: 'You must be a registered donor to log a donation' });
    }

    const donorId = donorRes.rows[0].id;

    const result = await pool.query(
      `INSERT INTO donations (donor_id, donation_type, donation_date, location, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [donorId, donation_type || 'Whole Blood', donation_date || new Date(), location || null, notes || null]
    );

    // Also update last_donation_date on the donor record
    await pool.query(
      'UPDATE donors SET last_donation_date = $1 WHERE id = $2',
      [donation_date || new Date(), donorId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error adding donation' });
  }
};

// @desc    Get certificate data for a specific donation
// @route   GET /api/donations/:id/certificate
// @access  Private
const getCertificate = async (req, res) => {
  const userId = req.user.id;
  const donationId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT dn.id, dn.donation_type, dn.donation_date, dn.location,
              d.blood_type, u.name, u.email
       FROM donations dn
       JOIN donors d ON dn.donor_id = d.id
       JOIN users u ON d.user_id = u.id
       WHERE dn.id = $1 AND d.user_id = $2`,
      [donationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Donation record not found' });
    }

    const row = result.rows[0];

    res.json({
      certificateId: `HL-${String(row.id).padStart(6, '0')}`,
      donorName: row.name,
      donorEmail: row.email,
      bloodType: row.blood_type,
      donationType: row.donation_type,
      donationDate: row.donation_date,
      location: row.location || 'HemoLife Donation Center',
      issuedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error fetching certificate' });
  }
};

module.exports = {
  getMyDonations,
  addDonation,
  getCertificate,
};
