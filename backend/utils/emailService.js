const nodemailer = require('nodemailer');

// Create the transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports (uses STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  family: 4 // Force IPv4 to avoid Render's ENETUNREACH IPv6 issue
});

// Escape HTML to prevent injection in email templates
const escapeHtml = (text) => {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
};

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to HemoLife - Save Lives Today!',
    html: `
      <h2>Hello ${escapeHtml(name)}, Welcome to HemoLife!</h2>
      <p>Thank you for joining our community of lifesavers.</p>
      <p>Together, we can make a difference and save lives. Feel free to explore the dashboard, or register as a blood donor if you are eligible.</p>
      <br />
      <p>Best regards,<br/>The HemoLife Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending welcome email to ${email}:`, error);
  }
};

const sendUrgentRequestEmail = async (emails, bloodType, city, hospital_name, contact_number) => {
  if (!emails || emails.length === 0) return;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(','), // Send to multiple nearby donors
    subject: `🚨 URGENT: ${escapeHtml(bloodType)} Blood Needed in ${escapeHtml(city)}`,
    html: `
      <h2>Urgent Blood Request in Your Area!</h2>
      <p>We have an emergency. A patient at <strong>${escapeHtml(hospital_name)}</strong> in <strong>${escapeHtml(city)}</strong> urgently needs <strong>${escapeHtml(bloodType)}</strong> blood.</p>
      <p>If you are eligible to donate, please contact the family immediately at: <strong>${escapeHtml(contact_number)}</strong></p>
      <br />
      <p>Thank you for being a lifesaver.<br/>The HemoLife Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Urgent request email sent to ${emails.length} nearby donors.`);
  } catch (error) {
    console.error(`Error sending urgent request email:`, error);
  }
};

const sendCampaignConfirmationEmail = async (email, name, campaignName, date) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Confirmation: Registration for ${campaignName}`,
    html: `
      <h2>Hi ${escapeHtml(name)},</h2>
      <p>Thank you for registering for our upcoming campaign: <strong>${escapeHtml(campaignName)}</strong>.</p>
      <p>Date: ${new Date(date).toDateString()}</p>
      <p>We look forward to seeing you there!</p>
      <br />
      <p>Best regards,<br/>The HemoLife Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Campaign confirmation email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending campaign confirmation to ${email}:`, error);
  }
};

const sendCampaignReminderEmail = async (email, name, campaignName, date) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: Tomorrow is ${campaignName}!`,
      html: `
        <h2>Hi ${escapeHtml(name)},</h2>
        <p>This is a quick reminder that tomorrow is the day for our campaign: <strong>${escapeHtml(campaignName)}</strong>.</p>
        <p>Date: ${new Date(date).toDateString()}</p>
        <p>Your participation means a lot to us!</p>
        <br />
        <p>Best regards,<br/>The HemoLife Team</p>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Campaign reminder email sent to ${email}`);
    } catch (error) {
      console.error(`Error sending campaign reminder to ${email}:`, error);
    }
  };

const sendDonationRequestEmail = async (donorEmail, donorName, requestorName, requestorEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: donorEmail,
    subject: `🩸 Someone needs your help! Blood Donation Request`,
    html: `
      <h2>Hi ${escapeHtml(donorName)},</h2>
      <p><strong>${escapeHtml(requestorName)}</strong> urgently needs a blood donation and saw your profile on HemoLife.</p>
      <p>If you are available to donate, please contact them directly:</p>
      <ul>
        <li>Email: <strong>${escapeHtml(requestorEmail)}</strong></li>
      </ul>
      <p>Thank you for being a lifesaver!</p><p>The HemoLife Team</p>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Donation request email sent to ${donorEmail}`);
  } catch (error) {
    console.error(`Error sending donation request email:`, error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendUrgentRequestEmail,
  sendCampaignConfirmationEmail,
  sendCampaignReminderEmail,
  sendDonationRequestEmail
};
