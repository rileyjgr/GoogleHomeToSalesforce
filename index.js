/* eslint-disable promise/catch-or-return */
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');
const admin = require("firebase-admin");
const rq = require('request');

//var sfaccesstoken;
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// Job to get oauth details
exports.salesForceOauth = functions.pubsub.schedule('every 30 minutes').onRun((context) => {
  /*
    console.log('runs every 30 minutes');
    // init and gather env variables
    let client_id = `${functions.config().sfclient_id.key}`;
    let client_secret =`${functions.config().sfclient_secret.key}`;
    let username =`${functions.config().sfusername.key}`;
    let password =`${functions.config().sfpassword.key}`;

    function initialize() {
      // Setting URL and headers for request
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
      // Return new promise 
      return new Promise(((resolve, reject) => {
        // Do async job
          rq(options, (err, resp, body) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(JSON.parse(body));
              }
          })
      }))
  
  }
  
  function main() {
      var initializePromise = initialize();
      // eslint-disable-next-line promise/always-return
      initializePromise.then((result) => {
          console.log('result: ')
          console.log(result.access_token);
          sfaccesstoken = result.access_token;
          console.log("token: ");
          // Use user details from here
          console.log(sfaccesstoken);
      }, (err) => {
          console.log(err);
      })
  }
  
  main();
*/
});

// Start dialog flow response
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  

  function Accounts(agent){
      let sfaccesstoken;
      let client_id = `${functions.config().sfclient_id.key}`;
      let client_secret =`${functions.config().sfclient_secret.key}`;
      let username =`${functions.config().sfusername.key}`;
      let password =`${functions.config().sfpassword.key}`;

      function initialize() {
        // Setting URL and headers for request
        let options = { 
            method: 'POST',
            url: 'https://tcshackathon-dev-ed.my.salesforce.com/services/oauth2/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            formData: { 
                grant_type: 'password',
                client_id: client_id,
                client_secret: client_secret,
                username: username,
                password: password
              } 
            };
        // Return new promise 
        return new Promise(((resolve, reject) => {
          // Do async job
            rq(options, (err, resp, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(body));
                }
            })
        }))
    
    }
      function saveToSF(){
        let auth = 'Bearer' + ' '+ sfaccesstoken;
        // Save to salesforce
        console.log(agent.parameters);
        console.log('token: ' + auth);

        let Name        = agent.parameters.CompanyName;
        let PhoneNumber = agent.parameters.PhoneNumber;
        let Street      = agent.parameters.Street[0];
        let City        = agent.parameters.City[0];
        let State       = agent.parameters.State;
        let ZipCode     = agent.parameters.ZipCode;

        const sfPost ={Name, PhoneNumber, Street, City, State, ZipCode};
        console.log('to Salesforce: '+ sfPost);

            // init options account
            let options = {
            method: 'POST',
            url: 'https://tcshackathon-dev-ed.my.salesforce.com/services/data/v37.0/sobjects/account',
            headers: { 
                  Authorization: auth,
                  Accept: 'application/json',
                  Content: 'application/json' 
              },
              body: {
                  Name: Name,
                  Phone: PhoneNumber,
                  BillingStreet: Street,
                  BillingCity: City,
                  BillingState: State,
                  BillingPostalCode: ZipCode
              },
              json: true 
          };
            // send request
          rq(options, (error, response, body) => {
            if (error) throw new Error(error);
            console.log(body);
            
        });
        console.log(sfaccesstoken);
        
    }

    function main() {
        var initializePromise = initialize();
        // eslint-disable-next-line promise/always-return
        initializePromise.then((result) => {
            console.log('result: ')
            console.log(result.access_token);
            sfaccesstoken = result.access_token;
            console.log("token: ");
            // Use user details from here
            console.log(sfaccesstoken);
            saveToSF();
        }, (err) => {
            console.log(err);
        })

        agent.add('Account Saved');
    }
    main();
    
  }

  function Contacts(agent){
    // add logic to save
      let sfaccesstoken;
      let client_id = `${functions.config().sfclient_id.key}`;
      let client_secret =`${functions.config().sfclient_secret.key}`;
      let username =`${functions.config().sfusername.key}`;
      let password =`${functions.config().sfpassword.key}`;

      function initialize() {
        // Setting URL and headers for request
        let options = { 
            method: 'POST',
            url: 'https://tcshackathon-dev-ed.my.salesforce.com/services/oauth2/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            formData: { 
                grant_type: 'password',
                client_id: client_id,
                client_secret: client_secret,
                username: username,
                password: password
              } 
            };
        // Return new promise 
        return new Promise(((resolve, reject) => {
          // Do async job
            rq(options, (err, resp, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(body));
                }
            })
        }))
    
    }
      function saveToSF(){
        let auth = 'Bearer' + ' '+ sfaccesstoken;
        // Save to salesforce
        console.log(agent.parameters);
        console.log('token: ' + auth);

        let LastName      = agent.parameters.Name;
        let PhoneNumber   = agent.parameters.PhoneNumber;
        let Email         = agent.parameters.Email;
        let Street        = agent.parameters.Street;
        let City          = agent.parameters.City[0];
        let State         = agent.parameters.State;
        let ZipCode       = agent.parameters.ZipCode[0];

        const sfPost ={LastName, PhoneNumber, Email, Street, City, State, ZipCode};
        console.log('to Salesforce: '+ sfPost)
        // init options account
        let options = {
            method: 'POST',
            url: 'https://tcshackathon-dev-ed.my.salesforce.com/services/data/v37.0/sobjects/Contact',
            headers: { 
                  Authorization: auth,
                  Accept: 'application/json',
                  Content: 'application/json' 
              },
              body: {
                  LastName: LastName,
                  HomePhone: PhoneNumber,
                  Email: Email,
                  MailingStreet: Street,
                  MailingCity: City,
                  MailingState: State,
                  MailingPostalCode: ZipCode
              },
              json: true 
          };
            // send request
          rq(options, (error, response, body) => {
            if (error) throw new Error(error);
            // Salesforce response
            console.log(body);
            
        });
        console.log(sfaccesstoken);
        
    }

    function main() {
        var initializePromise = initialize();
        // eslint-disable-next-line promise/always-return
        initializePromise.then((result) => {
            console.log('result: ')
            console.log(result.access_token);
            sfaccesstoken = result.access_token;
            console.log("token: ");
            // Use user details from here
            console.log(sfaccesstoken);
            saveToSF();
        }, (err) => {
            console.log(err);
        })
        agent.add('Contact Saved');
    }
    main();

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