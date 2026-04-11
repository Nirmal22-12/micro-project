const express = require('express');
const router = express.Router();
const { getMyDonations, addDonation, getCertificate } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyDonations)
  .post(protect, addDonation);

router.get('/:id/certificate', protect, getCertificate);

module.exports = router;
