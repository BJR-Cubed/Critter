'use strict';

const base64 = require('base-64');
const inquirer = require('inquirer');

const axios = require('axios');

let API_URL = process.env.API_URL || 'http://localhost:3000';
// axios.get
// axios.post

let globalAnswers = [];

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
  
];

let handleSignup = async (displayName, handle, password) =>{
  let data = {
    displayName,
    handle,
    password,
  };
  let response = await axios.post(`${API_URL}/signup`, data );
  console.log(response.data);
};


inquirer
  .prompt(questions)
  .then( async (answers) => {
    console.log(answers, ' are the answers');
    globalAnswers[0] = answers;
    await handleSignup(answers.enterNewDisplayName, answers.enterNewHandle, answers.newPassword);
  })
  .then(() => {
    console.log(globalAnswers[0].newPassword);
  });

// inquirer.prompt(questions).then((answers) => {
//   console.log('\nOrder receipt:');
//   console.log(JSON.stringify(answers, null, '  '));
// });