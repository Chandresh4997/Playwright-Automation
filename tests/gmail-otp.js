// gmail-otp.js
require('dotenv').config();
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

async function getGmailClient() {
  const tokens = {
    access_token: process.env.ACCESS_TOKEN,
    refresh_token: process.env.REFRESH_TOKEN,
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    token_type: 'Bearer',
    expiry_date: 1781880705515
  };
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oAuth2Client.setCredentials(tokens);
  return google.gmail({ version: 'v1', auth: oAuth2Client });
}

// ... rest of the file stays exactly the same
// async function getGmailClient() {
//   const tokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'token.json')));
//   const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
//   oAuth2Client.setCredentials(tokens);
//   return google.gmail({ version: 'v1', auth: oAuth2Client });
// }

function extractBody(message) {
  let data = '';
  function walkParts(part) {
    if (part.body?.data) {
      data += Buffer.from(part.body.data, 'base64').toString('utf-8');
    }
    if (part.parts) part.parts.forEach(walkParts);
  }
  walkParts(message.payload);
  return data;
}

async function getOtpCode({ from, subjectContains, sentAfter }) {
  const gmail = await getGmailClient();

  for (let attempt = 0; attempt < 15; attempt++) {
    const query = `from:${from} subject:"${subjectContains}" after:${sentAfter}`;
    console.log('Gmail query:', query);

    const res = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 1,
    });

    console.log('Messages found:', res.data.messages?.length || 0);

    if (res.data.messages?.length) {
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: res.data.messages[0].id,
        format: 'full',
      });

      const body = extractBody(msg.data);
      const cleanBody = body.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ');
      console.log('--- BODY ---', cleanBody.slice(0, 300));

      const otpMatch = cleanBody.match(/(\d{6})\s+is the OTP for your email verification/i);
      if (otpMatch) {
        console.log('OTP found:', otpMatch[1]);
        return otpMatch[1];
      }
    }

    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('OTP email not found in time');
}

module.exports = { getOtpCode };