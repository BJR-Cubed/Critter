'use strict';

const inquirer = require('inquirer');

const axios = require('axios');
require('dotenv').config();

let API_URL = process.env.API_URL || 'http://localhost:3000';

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
    },
  },
  {
    type: 'input',
    name: 'enterNewHandle',
    message: 'What would you like your handle to be?',
    prefix: '',
    when(answers) {
      return answers.enterNewDisplayName;
    },
  },
  {
    type: 'password',
    name: 'newPassword',
    message: 'What would you like your password to be?',
    mask: '*',
    prefix: '',
    when(answers) {
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
    },
  },
  {
    type: 'password',
    name: 'enterPassword',
    message: 'Please enter your password:',
    mask: '*',
    prefix: '',
    when(answers) {
      return answers.hasAccount === 'yes';
    },
  },

];

let handleSignup = async (displayName, handle, password) => {
  let data = {
    displayName,
    handle,
    password,
  };
  let response = await axios.post(`${API_URL}/signup`, data);
  return response.data.token;
};

let handleSignin = async (handle, password) => {
  let response = await axios.post(`${API_URL}/signin`, null, { auth: { username: handle, password: password } });
  return response.data.token;
};

const questions2 = [
  {
    type: 'list',
    name: 'CRUD',
    message: 'What would you like to do?',
    choices: ['See existing posts', 'Create a post', 'Update an existing post', 'Delete a post'],
    filter(response) {
      return response.toLowerCase();
    },
    prefix: '',
  },
  {
    type: 'input',
    name: 'id',
    message: 'Specify the message id or press enter to see all messages',
    prefix: '',
    when(answers) {
      return answers.CRUD === 'update an existing post' || answers.CRUD === 'delete a post' || answers.CRUD === 'see existing posts';
    },
  },
  {
    type: 'input',
    name: 'body',
    message: 'Specify the body text',
    prefix: '',
    when(answers) {
      return answers.CRUD === 'update an existing post' || answers.CRUD === 'create a post';
    },
  },
];

async function promptContainer() {
  await inquirer
    .prompt(questions)
    .then(async (answers) => {
      if (answers.hasAccount === 'yes') {
        token = await handleSignin(answers.enterLoginHandle, answers.enterPassword);
      } else if (answers.hasAccount === 'no') {
        token = await handleSignup(answers.enterNewDisplayName, answers.enterNewHandle, answers.newPassword);
      }
    });

  await inquirer.prompt(questions2).then(async (answers) => {
    switch (answers.CRUD) {
    case 'create a post':
      await handleCreate(answers.body);
      break;
    case 'see existing posts':
      await handleRead(answers.id);
      break;
    case 'update an existing post':
      await handleUpdate(answers.body, answers.id);
      break;
    case 'delete a post':
      await handleDelete(answers.id);
      break;
    default:
      console.log('Invalid selection');
    }
  });
}

let handleCreate = async (body) => {
  const data = {
    body,
  };
  const config = { headers: { 'Authorization': `Bearer ${token}` } };
  let response = await axios.post(`${API_URL}/messages`, data, config);
  console.log(response.data);
};

let handleUpdate = async (body, id) => {
  const data = {
    body,
  };
  const config = { headers: { 'Authorization': `Bearer ${token}` } };
  let response = await axios.put(`${API_URL}/messages/${id}`, data, config);
  console.log(response.data);
};

let handleRead = async (id) => {
  const config = { headers: { 'Authorization': `Bearer ${token}` } };
  let route = `${API_URL}/messages/${id}`;
  let response = await axios.get(route, config);
  console.log(response.data);
};

let handleDelete = async (id) => {
  const config = { headers: { 'Authorization': `Bearer ${token}` } };
  let route = `${API_URL}/messages/${id}`;
  let response = await axios.delete(route, config);
  console.log(response.status);
};

promptContainer();
