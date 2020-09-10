const nodemailer = require("nodemailer");


const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const transporting = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'anusricoding@gmail.com',
      pass: 'Akhil2000'
  }
});

var x;
// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Tasks API.
  authorize(JSON.parse(content), list);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */


function list(auth) {
  var a= "Anusri Patti"
  var name = [];
  var mail = [];
  const service = google.people({version: 'v1', auth});
  service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses',
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const connections = res.data.connections;
    if (connections) {
      console.log('Connections:');
      connections.forEach((person) => {
          console.log(person.names[0].displayName);
          name.push(person.names[0].displayName);
          console.log(person.emailAddresses[0].value);
          mail.push(person.emailAddresses[0].value);
      });
      console.log(name);
      console.log(mail);
      var l= name.length;
      console.log(l);
    } else {
      console.log('No connections found.');
    }
    for(let k =0 ; k<l;k++){
      if(a==name[k]){
        x = mail[k];
        console.log(x);
      }
    }
    const mailOptions = {
      from: "Qwikcilver", 
      to: x, 
      subject: "You have recieved a giftcard!", 
      html: `<p>Hello ! <br> You have recieved. </p>`
    }
    
    transporting.sendMail(mailOptions, (err, info) => {
    if(err) { 
      console.log(err); 
    } else { 
      console.log('Email sent successfully'); 
    } 
    })
    
    
  });
}


