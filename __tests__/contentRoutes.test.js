'use strict';

const supertest = require('supertest');
const { authSequelize } = require('../server/auth/models/index.js');
const { app } = require('../server/server.js');
const request = supertest(app);

//server/index.js needs some work?
const user = { 
  handle: 'testHandle', 
  displayName: 'testHandle', 
  password: 'password'
};

let testUser; //await request.post('/signup').send(user)

beforeAll((done) => {
  authSequelize.sync();
  done();
});

afterAll(() => {
  authSequelize.drop();
});

describe('Content Routes functionality with login token', () => {
  test('Should post a message', async () => {
    testUser = await request.post('/signup').send(user);
    testUser = testUser.body;

    const response = await request.post('/messages').set('authorization', `Bearer ${testUser.token}`);


    // console.log('Testuser keys are', Object.keys(testUser));
    // console.log('Testuser body is', testUser.body);
    // const response = await request.get('/badroute');
    
    expect(response.status).toBe(201); //404 until create
    expect(response.body.timeStamp).toBeTruthy();
  });

  test('Should send 404 code on bad route', async () => {
    // const response = await request.get('/signup');
    
    // expect(response.status).toBe(404);
  });



});

