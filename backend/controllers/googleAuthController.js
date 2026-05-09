const { OAuth2Client } = require('google-auth-library');
const pool = require('../db');
const generateToken = require('../utils/generateToken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Authenticate with Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Check if user already exists
    let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (userResult.rows.length > 0) {
      // Existing user — update avatar if not set
      user = userResult.rows[0];
      if (!user.avatar && picture) {
        await pool.query('UPDATE users SET avatar = $1 WHERE id = $2', [picture, user.id]);
        user.avatar = picture;
      }
    } else {
      // New user — create account (no password needed for Google auth)
      // Generate a random password hash since the field is NOT NULL
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(`google_${googleId}_${Date.now()}`, salt);

      const newUserResult = await pool.query(
        'INSERT INTO users (name, email, password, role, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, email, randomPassword, 'user', picture || null]
      );
      user = newUserResult.rows[0];
    }

    // Get donor info if exists
    let donorInfo = {};
    const donorRes = await pool.query('SELECT blood_type, phone_number, city FROM donors WHERE user_id = $1', [user.id]);
    if (donorRes.rows.length > 0) {
      donorInfo = donorRes.rows[0];
    }

    // Return user data with app JWT token
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || picture || null,
      joinedDate: user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear(),
      bloodType: donorInfo.blood_type || null,
      phone: donorInfo.phone_number || '-',
      location: donorInfo.city || null,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Google auth error:', error.message);
    res.status(401).json({ message: 'Invalid Google credential' });
  }
};

module.exports = { googleAuth };
