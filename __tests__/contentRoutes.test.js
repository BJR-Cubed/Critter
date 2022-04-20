'use strict';

const supertest = require('supertest');
const { authSequelize } = require('../server/auth/models/index.js');
const { contentSequelize } = require('../server/models/');
const { app } = require('../server/server.js');
const request = supertest(app);

//server/index.js needs some work?
const user = { 
  handle: 'testHandle', 
  displayName: 'testHandle', 
  password: 'password',
};

let testUser; //await request.post('/signup').send(user)

beforeAll((done) => {
  authSequelize.sync();
  contentSequelize.sync();
  done();
});

afterAll(() => {
  authSequelize.drop();
  contentSequelize.drop();
});

describe('Content Routes functionality with login token', () => {
  test('Should post a message', async () => {
    testUser = await request.post('/signup').send(user);
    testUser = testUser.body;

    const response = await request
      .post('/messages')
      .set('authorization', `Bearer ${testUser.token}`)
      .send({
        body: 'Our first message',
      });


    // console.log('Testuser keys are', Object.keys(testUser));
    // console.log('Testuser body is', testUser.body);
    // const response = await request.get('/badroute');
    
    expect(response.status).toBe(201); //404 until create
    expect(response.body.timestamp).toBeTruthy();
  });

  test('Should get messages', async () => {
    let response = await request.get('/messages').set('authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body[0].timestamp).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Should get one message', async () => {
    let response = await request.get('/messages/1').set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(1);
  });

  test('Should update a message', async () => {
    let response = await request.put('/messages/1').set('Authorization', `Bearer ${testUser.token}`).send({
      body: 'Our updated message',
    });
    
    expect(response.status).toBe(200);
    expect(response.body.body).toBe('Our updated message');
  });

  test('Should delete a message', async () => {
    let response = await request.delete('/messages/1').set('Authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(204);
  });

  test('Should send 403 code when there is no authorization', async () => {
    const response = await request
      .post('/messages')
      .send({
        body: 'Our first message',
      });
    
    expect(response.status).toBe(403);
  });

  test('Should send 403 code where token is invalid', async () => {
    const response = await request
      .post('/messages')
      .set('authorization', 'Bearer bAdToKEn')
      .send({
        body: 'Our first message',
      });
    
    expect(response.status).toBe(403);
  });





});

describe('Testing with invalid requests', () => {
  test('Should post a message', async () => {
    // testUser = await request.post('/signup').send(user);
    // testUser = testUser.body;

    const response = await request
      .post('/messages')
      .set('authorization', `Bearer ${testUser.token}`)
      .send({
        //purposely creating an error with empty object
      });
    
    expect(response.status).toBe(500); //404 until create
  });

  test('Should not get messages and return null if id does not exist', async () => {
    let response = await request.get('/messages/1999').set('authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(500);
  });

});