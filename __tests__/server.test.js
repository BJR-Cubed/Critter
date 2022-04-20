'use strict';

const supertest = require('supertest');
const { app } = require('../server/server.js');
const request = supertest(app);

describe('Basic Server Functionality', () => {
  test('Should send 404 code on bad route', async () => {
    const response = await request.get('/badroute');
    
    expect(response.status).toBe(404);
  });

  test('Should send 404 code on bad route', async () => {
    const response = await request.get('/signup');
    
    expect(response.status).toBe(404);
  });

});
