const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken && twilioNumber) {
  try {
    client = twilio(accountSid, authToken);
  } catch (error) {
    console.error("Twilio initialization error:", error);
  }
} else {
  console.warn("Twilio credentials not fully provided. Call masking mock mode enabled.");
}

/**
 * Initiates a masked call between user and donor.
 * @param {string} callerPhone - The phone number of the authenticated user
 * @param {string} donorPhone - The phone number of the requested donor
 * @returns {Promise<object>} The call status or mock status
 */
const initiateMaskedCall = async (callerPhone, donorPhone) => {
  if (!client) {
    console.log(`[MOCK TWILIO] Initiating masked call from ${twilioNumber || '+1234567890'} to Caller: ${callerPhone}`);
    console.log(`[MOCK TWILIO] When Caller picks up, it will bridge to Donor: ${donorPhone}`);
    // Simulate a slight delay
    await new Promise(res => setTimeout(res, 1000));
    return { status: 'mock_queued', message: 'Call initiated in mock mode' };
  }

  try {
    // We use TwiML to define what happens when the caller picks up.
    // Twilio will dial the donorPhone and bridge the connection.
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Please wait while we connect you to the donor.');
    const dial = twiml.dial({ callerId: twilioNumber });
    dial.number(donorPhone);

    const call = await client.calls.create({
      twiml: twiml.toString(),
      to: callerPhone,
      from: twilioNumber,
    });

    console.log(`Masked call initiated: SID ${call.sid}`);
    return { status: call.status, sid: call.sid };
  } catch (error) {
    console.error('Twilio Call Error:', error);
    throw new Error('Failed to initiate call via Twilio');
  }
};

module.exports = {
  initiateMaskedCall
};
