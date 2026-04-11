const express = require('express');
const Routes = express.Router();
const { registerForCampaign } = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

Routes.post('/:id/register', protect, registerForCampaign);

module.exports = Routes;
