const express = require('express');
const router = express.Router();
const { createRequest, getOpenRequests } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

// The route is protected, meaning random users cannot post emergencies
router.route('/')
  .post(protect, createRequest)
  .get(protect, getOpenRequests);

module.exports = router;
