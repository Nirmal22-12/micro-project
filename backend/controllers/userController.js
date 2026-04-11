const pool = require('../db');

// @desc    Update user profile (name, avatar and donor info if any)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { name, avatar, blood_type, phone_number, city } = req.body;
  const userId = req.user.id;

  // Convert empty strings to null so COALESCE preserves existing DB values
  const toNull = (val) => (val && val.trim() !== '' && val.trim() !== '-') ? val.trim() : null;

  try {
    // 1. Update general user info (name, avatar)
    await pool.query(
      'UPDATE users SET name = COALESCE($1, name), avatar = COALESCE($2, avatar) WHERE id = $3',
      [toNull(name), toNull(avatar), userId]
    );

    // 2. Update donor info — create donor record if it doesn't exist but donor fields are provided
    const donorRes = await pool.query('SELECT * FROM donors WHERE user_id = $1', [userId]);

    if (donorRes.rows.length > 0) {
      // User is already a donor — update their record
      await pool.query(
        'UPDATE donors SET blood_type = COALESCE($1, blood_type), phone_number = COALESCE($2, phone_number), city = COALESCE($3, city) WHERE user_id = $4',
        [toNull(blood_type), toNull(phone_number), toNull(city), userId]
      );
    } else if (toNull(blood_type)) {
      // User is not a donor yet but provided a blood type — create a donor record
      await pool.query(
        'INSERT INTO donors (user_id, blood_type, phone_number, city) VALUES ($1, $2, $3, $4)',
        [userId, blood_type, toNull(phone_number), toNull(city)]
      );
    }

    // 3. Fetch updated info
    const updatedUserRes = await pool.query('SELECT id, name, email, role, avatar, created_at FROM users WHERE id = $1', [userId]);
    const user = updatedUserRes.rows[0];

    // Get updated donor specific details to return
    let donorInfo = {};
    const updatedDonorRes = await pool.query('SELECT blood_type, phone_number, city FROM donors WHERE user_id = $1', [userId]);
    if (updatedDonorRes.rows.length > 0) {
      donorInfo = updatedDonorRes.rows[0] || {};
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      joinedDate: user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear(),
      bloodType: donorInfo.blood_type || null,
      phone: donorInfo.phone_number || null,
      location: donorInfo.city || null
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = {
  updateUserProfile
};
