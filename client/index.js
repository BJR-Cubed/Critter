'use strict';

const base64 = require('base-64');
const inquirer = require('inquirer');

const axios = require('axios');

// axios.get
// axios.post

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
];

inquirer
  .prompt(questions)
  .then((answers) => {
    console.log(answers, ' are the answers');
  })
;

// inquirer.prompt(questions).then((answers) => {
//   console.log('\nOrder receipt:');
//   console.log(JSON.stringify(answers, null, '  '));
// });