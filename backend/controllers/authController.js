const bcrypt = require('bcryptjs');
const pool = require('../db');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Prevent privilege escalation - only allow safe roles
  const allowedRoles = ['user', 'donor'];
  const safeRole = allowedRoles.includes(role) ? role : 'user';

  try {
    // Check if user exists
    const userExistResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExistResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into database
    const newUserResult = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, safeRole]
    );

    const user = newUserResult.rows[0];

    // Send Welcome Email asynchronously
    const { sendWelcomeEmail } = require('../utils/emailService');
    sendWelcomeEmail(user.email, user.name);

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        joinedDate: user.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear(),
        bloodType: null,
        phone: "-",
        location: null,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const donorRes = await pool.query('SELECT blood_type, phone_number, city FROM donors WHERE user_id = $1', [user.id]);
      let donorInfo = {};
      if (donorRes.rows.length > 0) {
        donorInfo = donorRes.rows[0];
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
        joinedDate: user.created_at ? new Date(user.created_at).getFullYear() : "2024",
        bloodType: donorInfo.blood_type || null,
        phone: donorInfo.phone_number || "-",
        location: donorInfo.city || null,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
