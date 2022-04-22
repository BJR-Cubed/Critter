'use strict';

const supertest = require('supertest');
const { app } = require('../server/server.js');
const request = supertest(app);

const user = { 
  handle: 'testHandle', 
  displayName: 'testHandle', 
  password: 'password',
};

let testUser; 

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
    
    expect(response.status).toBe(201); 
    expect(response.body.body).toBeTruthy();
  });

  test('Should get messages', async () => {
    let response = await request.get('/messages').set('authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(200);
    expect(response.body[0].body).toBeTruthy();
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

    const response = await request
      .post('/messages')
      .set('authorization', `Bearer ${testUser.token}`)
      .send({
        //purposely creating an error with empty object
      });
    
    expect(response.status).toBe(500); 
  });

  test('Should not get a message if it does not exist', async () => {
    let response = await request
      .get('/messages/1999')
      .set('authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(500);
  });

  test('Should not delete a message if id is invalid', async () => {
    let response = await request.delete('/messages/1999').set('authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(500);
  });

  test('Should not update a message if id is invalid', async () => {
    let response = await request.put('/messages/1999').set('authorization', `Bearer ${testUser.token}`);

    expect(response.status).toBe(500);
  });

  test('Should not update a message if update body data is invalid', async () => {
    let response = await request
      .post('/messages')
      .set('authorization', `Bearer ${testUser.token}`)
      .send({
        body: 'Our test message',
      });
    let id = response.body.id;  

    response = await request.put(`/messages/${id}`).set('Authorization', `Bearer ${testUser.token}`).send({
      body: null,
    });

    expect(response.status).toBe(500);
  });

});
