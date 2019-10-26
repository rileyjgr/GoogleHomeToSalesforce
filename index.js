// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');
const rq = require('request');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

let sfaccesstoken = '';

// Job to get oauth details
exports.salesForceOauth = functions.pubsub.schedule('every 30 minutes').onRun((context) => {
    console.log('runs every 30 minutes');
    // init and gather env variables
    let client_id = `${functions.config().sfclient_id.key}`;
    let client_secret =`${functions.config().sfclient_secret.key}`;
    let username =`${functions.config().sfusername.key}`;
    let password =`${functions.config().sfpassword.key}`;

    // options for request
    let options = { 
    method: 'POST',
    url: 'https://na114.salesforce.com/services/oauth2/token',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
    formData: { 
        grant_type: 'password',
        client_id: client_id,
        client_secret: client_secret,
        username: username,
        password: password
      } 
    };
  // send request
  rq(options, (error, response, body) => {
    if (error) throw new Error(error);
    // add logic to update token in firebase
    console.log('body: ' + body);
    var token = body[0].access_token;
    return sfaccesstoken = body[0].access_token;
  });
});

// Start dialog flow response
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function Accounts(agent){
    let auth = 'Bearer' + ' '+ sfaccesstoken;
    // Save to salesforce
    console.log(agent.parameters);
    
    let name = agent.parameters.Name;
        // init options account
        let options = {
        method: 'POST',
        url: 'https://na114.salesforce.com/services/data/v37.0/sobjects/account',
        headers: { 
              Authorization: auth,
              Accept: 'application/json',
              Content: 'application/json' 
          },
          body: {
              Name: name 
          },
          json: true 
        };
        // send request
      rq(options, (error, response, body) => {
        if (error) throw new Error(error);
        console.log(body);
    });
    console.log(sfaccesstoken);
    agent.add('Account Saved');
  }

  function Contacts(agent){
    // add logic to save
    agent.add('contact hit');
  }
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Accounts', Accounts);
  intentMap.set('Contacts', Contacts);
  agent.handleRequest(intentMap);
});