// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');
const request = require('request-promise');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// Job to get oauth details
exports.salesForceOauth = functions.pubsub.schedule('every 30 minutes').onRun((context) => {
    console.log('runs every 30 minutes');

    // set options for oauth
    let options = {
      method: 'POST',
      uri: 'https://na114.lightning.force.com/services/oauth2/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        grant_type: 'password',
        client_id: `${functions.config().salesforceoauth.id}`,
        client_secret: `${functions.config().salesforceoauth.key}`,
        username:`${functions.config().salesforce.username}`,
        password:`${functions.config().salesforce.password}`
      }
    }

    // start request 
    request(options)
      // eslint-disable-next-line prefer-arrow-callback
      .then((body)=>{
        // send request and save data 
        console.log(body);
        return null;
      })
      .catch((err) => {
        console.log(err);
      });
});

// Start dialog flow response
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function Accounts(agent){
    // add logic to save
    agent.add('account hit');
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