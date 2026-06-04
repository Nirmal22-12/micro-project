const { sendWelcomeEmail } = require('./utils/emailService');
require('dotenv').config();

// Get target email from CLI argument or default to EMAIL_FROM/onboarding email
const targetEmail = process.argv[2] || process.env.EMAIL_FROM || 'onboarding@resend.dev';

console.log(`Sending test email to: ${targetEmail}...`);

sendWelcomeEmail(targetEmail, 'Test Lifesaver')
  .then(() => {
    console.log("Email task completed! Check your inbox/spam folder.");
  })
  .catch(err => {
    console.error("Test failed with error:", err);
  });
