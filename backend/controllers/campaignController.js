const pool = require('../db');
const { sendCampaignConfirmationEmail } = require('../utils/emailService');

// @desc    Register a user for a campaign
// @route   POST /api/campaigns/:id/register
// @access  Private
const registerForCampaign = async (req, res) => {
  const campaign_id = req.params.id;
  const user_id = req.user.id;

  try {
    // Check if campaign exists
    const campRes = await pool.query('SELECT * FROM campaigns WHERE id = $1', [campaign_id]);
    if (campRes.rows.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    const campaign = campRes.rows[0];

    // Register user
    await pool.query(
      'INSERT INTO campaign_registrations (campaign_id, user_id) VALUES ($1, $2)',
      [campaign_id, user_id]
    );

    // Get user details
    const userRes = await pool.query('SELECT name, email FROM users WHERE id = $1', [user_id]);
    const user = userRes.rows[0];

    // Send confirmation email
    sendCampaignConfirmationEmail(user.email, user.name, campaign.name, campaign.event_date);

    res.status(201).json({ message: 'Successfully registered for campaign' });
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ message: 'Already registered for this campaign' });
    }
    console.error(error.message);
    res.status(500).json({ message: 'Server error registering for campaign' });
  }
};

module.exports = {
  registerForCampaign
};
