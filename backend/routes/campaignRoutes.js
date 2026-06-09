const express = require('express');
const Routes = express.Router();
const { registerForCampaign, getCampaigns, createCampaign } = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

Routes.get('/', getCampaigns);
Routes.post('/', protect, createCampaign);
Routes.post('/:id/register', protect, registerForCampaign);

module.exports = Routes;
