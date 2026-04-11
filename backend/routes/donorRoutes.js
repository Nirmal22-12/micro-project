const express = require('express');
const router = express.Router();
const { createDonor, getDonors, searchDonors, getDonorSuggestions, getDonorById, requestDonation, callDonor } = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');
const { callRateLimiter } = require('../middleware/rateLimiter');

router.get('/search/suggestions', getDonorSuggestions);
router.get('/search', searchDonors);

router.route('/')
  .post(protect, createDonor) // Protect POST route so req.user gets populated
  .get(getDonors);            // You can also add protect here if you only want logged in users to see donors

router.get('/:id', getDonorById);
router.post('/:id/request', protect, requestDonation);
router.post('/:id/call', protect, callRateLimiter, callDonor);

module.exports = router;
