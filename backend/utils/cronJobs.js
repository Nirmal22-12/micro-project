const cron = require('node-cron');
const pool = require('../db');
const { sendCampaignReminderEmail } = require('./emailService');

// Run every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Running campaign reminder cron job...');
  try {
    // Find campaigns happening tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Note: Depends on your DB timezone. Adjust query accordingly if needed.
    const campaignsRes = await pool.query('SELECT * FROM campaigns WHERE event_date = $1', [tomorrowStr]);
    
    if (campaignsRes.rows.length === 0) return;

    for (let campaign of campaignsRes.rows) {
      // Find registered users for this campaign
      const regsRes = await pool.query(`
        SELECT u.email, u.name 
        FROM campaign_registrations cr
        JOIN users u ON cr.user_id = u.id
        WHERE cr.campaign_id = $1
      `, [campaign.id]);

      // Dispatch reminder emails
      for (let user of regsRes.rows) {
        sendCampaignReminderEmail(user.email, user.name, campaign.name, campaign.event_date);
      }
    }
  } catch (error) {
    console.error('Error in campaign reminder cron job:', error);
  }
});

console.log('Cron jobs scheduled.');
