'use strict';

const { authSequelize } = require('../server/auth/models');
const { app } = require('../server/server.js');
const supertest = require('supertest');
const request = supertest(app);
const base64 = require('base-64');


//server/index.js and this test file are both syncing the database...need to fix

beforeAll((done) => {
  authSequelize.sync();
  done();
});

afterAll(() => {
  authSequelize.drop();
});


describe('Auth Route Testing', () => {
  let testDisplayName = 'user';
  let testHandle = 'coolguy';
  let testpassword = 'password';
  
  test('Should allow user to signup', async () => {
    let response = await request.post('/signup').send({
      displayName: testDisplayName,
      handle: testHandle,
      password: testpassword,
    });
    // console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.displayName).toBe(testDisplayName);
    expect(response.body.handle).toBe(testHandle);
    expect(response.body.password).toBeTruthy();
  });

  test('Should allow a valid user to signin', async () => {
    let authString = `${testHandle}:${testpassword}`;
    let encodedString = base64.encode(authString);
    let response = await request.post('/signin').set('Authorization', `Basic ${encodedString}`);

    expect(response.status).toBe(200);
    expect(response.body.displayName).toBe(testDisplayName);
    expect(response.body.token).toBeTruthy();
  });
});