'use strict';

// const { authSequelize } = require('../server/auth/models');
const { app } = require('../server/server.js');
const supertest = require('supertest');
const request = supertest(app);
const base64 = require('base-64');


//server/index.js and this test file are both syncing the database...need to fix

// beforeAll((done) => {
//   authSequelize.sync();
//   done();
// });

// afterAll(() => {
//   authSequelize.drop();
// });


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

  test('Should not allow a user with invalid credentials to signin', async () => {
    let response = await request.post('/signin').set('Authorization', 'Basic BadAuthString');

    expect(response.status).toBe(403);
  });

  test('Should deny signup if displayName is empty', async () => {
    let response = await request.post('/signup').send({
      displayName: '',
      handle: testHandle,
      password: testpassword,
    });

    expect(response.status).toBe(500);

  });

  test('Should deny signup if handle is empty', async () => {
    let response = await request.post('/signup').send({
      displayName: testDisplayName,
      handle: '',
      password: testpassword,
    });

    expect(response.status).toBe(500);
    
  });
  test('Should deny signup if password is empty', async () => {
    let response = await request.post('/signup').send({
      displayName: testDisplayName,
      handle: testHandle,
      password: '',
    });

    expect(response.status).toBe(500);
    
  });
});
