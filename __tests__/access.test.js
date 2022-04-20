'use strict';

const supertest = require('supertest');
// const { authSequelize } = require('../server/auth/models/index.js');
// const { contentSequelize } = require('../server/models/');
const { app } = require('../server/server.js');
const request = supertest(app);

//server/index.js needs some work?
const user1Credentials = {
  handle: 'user1',
  displayName: 'user1',
  password: 'password',
};

const user2Credentials = {
  handle: 'user2',
  displayName: 'user2',
  password: 'password',
};

let testUser1;
let testUser2;

// beforeAll((done) => {
//   authSequelize.sync();
//   contentSequelize.sync();
//   done();
// });

// afterAll(() => {
//   authSequelize.drop();
//   contentSequelize.drop();
// });

describe('Testing message access', () => {

  test('User should not be able to update another user\'s message', async () => {
    testUser1 = await request.post('/signup').send(user1Credentials);
    testUser1 = testUser1.body;

    testUser2 = await request.post('/signup').send(user2Credentials);
    testUser2 = testUser2.body;

    let response = await request
      .post('/messages')
      .set('Authorization', `Bearer ${testUser1.token}`)
      .send({ body: 'I love having secure messages' });

    let id = response.body.id;
    
    response = await request
      .put(`/messages/${id}`)
      .set('Authorization', `Bearer ${testUser2.token}`)
      .send({ body: 'I hate having secure messages' });

    expect(response.status).toBe(403);
  });

  // Test for admin bypass
});
