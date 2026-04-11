const pool = require('../db');

// @desc    Get dashboard stats (blood type inventory counts)
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const statsResult = await pool.query(
      'SELECT blood_type, COUNT(*) as count FROM donors GROUP BY blood_type'
    );
    res.status(200).json(statsResult.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

module.exports = {
  getStats,
};
