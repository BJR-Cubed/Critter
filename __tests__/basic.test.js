'use strict';

const basicAuth = require('../server/auth/middleware/basic');
const { users } = require('../server/auth/models');

jest.mock('../server/auth/models', () => {
  return {
    users: {
      authenticateBasic: jest.fn((user, pass) => ({ empty: 'object'})),
    },
  };
});

const next = jest.fn();
const res = {
  status: jest.fn(),
  send: jest.fn(),
};

describe('Testing auth basic middleware', () => {

  test('Returns 403 with no auth header', () => {
    let req = {
      
    };
  });

  test('Returns 403 with a bad auth header', () => {
    
  });


  test('Assigns req.user ', () => {
    
  });
});
