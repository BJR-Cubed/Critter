'use strict';

const base64 = require('base-64');
const inquirer = require('inquirer');

const axios = require('axios');

let API_URL = process.env.API_URL || 'http://localhost:3000';
// axios.get
// axios.post

let token = '';

const questions = [
  {
    type: 'list',
    name: 'hasAccount',
    message: 'Welcome to Critter!\nDo you have an account?',
    choices: ['Yes', 'No'],
    filter(response) {
      return response.toLowerCase();
    },
    prefix: '',
  },
  {
    type: 'input',
    name: 'enterNewDisplayName',
    message: 'What would you like your Display Name to be?',
    prefix: '',
    when(answers) {
      return answers.hasAccount === 'no';
    } ,
  },
  {
    type: 'input',
    name: 'enterNewHandle',
    message: 'What would you like your handle to be?',
    prefix: '',
    when(answers) {
      return answers.enterNewDisplayName;
    } ,
  },
  {
    type: 'password',
    name: 'newPassword',
    message: 'What would you like your password to be?',
    mask: '*',
    prefix: '',
    when(answers){
      return answers.enterNewHandle;
    },
  },
  {
    type: 'input',
    name: 'enterLoginHandle',
    message: 'Please enter your Login Handle:',
    prefix: '',
    when(answers) {
      return answers.hasAccount === 'yes';
    } ,
  },
  {
    type: 'password',
    name: 'enterPassword',
    message: 'Please enter your password:',
    mask: '*',
    prefix: '',
    when(answers) {
      return answers.hasAccount === 'yes';
    } ,
  },

];

let handleSignup = async (displayName, handle, password) =>{
  let data = {
    displayName,
    handle,
    password,
  };
  let response = await axios.post(`${API_URL}/signup`, data );
  console.log('handlesignup response.data:', response.data);
  console.log('response.data.token is  (atsignupfunc)', response.data.token);
  return response.data.token;
};

//signin function needed
let handleSignin = async (handle, password) =>{
  // let data = {
  //   handle,
  //   password,
  // };
  console.log('handle and password are:', handle, password);
  let response = await axios.post(`${API_URL}/signin`, null, {auth: {username: handle, password: password} } );
  // console.log('handlesignin response.data:', response.data);
  console.log('response.data.token is (atsigninfunc)', response.data.token);
  return response.data.token;

};


inquirer
  .prompt(questions)
  .then( async (answers) => {
    console.log(answers, ' are the answers');
    // globalAnswers[0] = answers;

    if (answers.hasAccount === 'yes') {
      // handleSignin function called here
      token = await handleSignin(answers.enterLoginHandle, answers.enterPassword);
    } else if (answers.hasAccount === 'no') {
      token = await handleSignup(answers.enterNewDisplayName, answers.enterNewHandle, answers.newPassword);
    }
  })
  .then(() => {
    console.log('token is  (at inquirer)', token);

    // console.log('globalanswers[]0.newpassword is', globalAnswers[0].newPassword);
  });


// signin sign up block
// while loop inquirer prompt until escape key


// inquirer.prompt(questions).then((answers) => {
//   console.log('\nOrder receipt:');
//   console.log(JSON.stringify(answers, null, '  '));
// });