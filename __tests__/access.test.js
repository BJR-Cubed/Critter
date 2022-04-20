'use strict';

const supertest = require('supertest');
const { app } = require('../server/server.js');
const request = supertest(app);

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

const adminCredentials = {
  handle: 'admin',
  displayName: 'I am an Admin, fear me',
  password: 'password',
  role: 'admin',
};

let testUser1;
let testUser2;
let testAdmin;

describe('Testing message access', () => {

  test('User should not be able to update another user\'s message', async () => {
    // Sign up our users
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

  test('User should not be able to delete another user\'s message', async () => {
    let response = await request
      .post('/messages')
      .set('Authorization', `Bearer ${testUser1.token}`)
      .send({ body: 'I own my own messages' });

    let id = response.body.id;

    response = await request
      .delete(`/messages/${id}`)
      .set('Authorization', `Bearer ${testUser2.token}`);

    expect(response.status).toBe(403);
  });

  test('Admin should be able to update another user\'s message', async () => {
    // signup the admin
    testAdmin = await request.post('/signup').send(adminCredentials);
    testAdmin = testAdmin.body;

    // post a message
    let response = await request
      .post('/messages')
      .set('Authorization', `Bearer ${testUser1.token}`)
      .send({ body: 'I hope the admin doesn\'t change this' });

    let id = response.body.id;

    // try to update it
    response = await request
      .put(`/messages/${id}`)
      .set('Authorization', `Bearer ${testAdmin.token}`)
      .send({ body: 'Nope, I can change it' });

    expect(response.status).toBe(200);
    expect(response.body.body).toBe('Nope, I can change it');
  });

  test('Admin should be able to delete another user\'s message', async () => {
    let response = await request
      .post('/messages')
      .set('Authorization', `Bearer ${testUser1.token}`)
      .send({ body: 'I hope my message doesn\'t get deleted' });

    let id = response.body.id;

    response = await request
      .delete(`/messages/${id}`)
      .set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toBe(204);

    response = await request
      .get(`/messages/${id}`)
      .set('Authorization', `Bearer ${testUser1.token}`);

    expect(response.status).toBe(500);
  });
});
