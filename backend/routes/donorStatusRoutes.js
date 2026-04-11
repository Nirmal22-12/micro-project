const express = require('express');
const router = express.Router();
const { updateDonorStatus } = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');

// PATCH /api/donor/status
router.patch('/status', protect, updateDonorStatus);

module.exports = router;
