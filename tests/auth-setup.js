// auth-setup.js
require('dotenv').config();
const { google } = require('googleapis');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['https://www.googleapis.com/auth/gmail.readonly'],
});

console.log('Authorize this app by visiting:', authUrl);

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/oauth2callback')) {
    const code = new URL(req.url, REDIRECT_URI).searchParams.get('code');
    const { tokens } = await oAuth2Client.getToken(code);
    fs.writeFileSync(path.join(__dirname, 'token.json'), JSON.stringify(tokens, null, 2));
    res.end('Auth successful! Token saved. You can close this tab.');
    console.log('token.json saved at', path.join(__dirname, 'token.json'));
    server.close();
  }
});

server.listen(3000, () => {
  console.log('Waiting for OAuth callback on http://localhost:3000 ...');
});