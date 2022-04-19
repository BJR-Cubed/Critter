'use strict';

const supertest = require('supertest');
const { app } = require('../server/server.js');
const request = supertest(app);

//server/index.js needs some work?

describe('Basic Server Functionality', () => {
  test('Should send 404 code on bad route', async () => {
    const response = await request.get('/badroute');
    
    expect(response.status).toBe(404);
  });
});