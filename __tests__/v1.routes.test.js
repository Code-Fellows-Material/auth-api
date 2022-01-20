'use strict';


const server = require('../lib/server.js').server;
const supertest = require('supertest');
const request = supertest(server);

const { db } = require('../lib/models/index.js');

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});


describe('Testing the food router', () => {

  it('should CREATE one from foods data', async () => {
    const response = await request.post('/api/v1/food').send({food: "banana", calories: 4, type: 'fruit'});
    expect(response.body).toBeDefined();
    expect(response.status).toEqual(201);
  });

  it('should read ALL from foods data', async () => {
    const response = await request.get('/api/v1/food');
    expect(response.body).toBeDefined();
    expect(response.status).toEqual(200);
  });

  it('should read ONE from foods data', async () => {
    const response = await request.get('/api/v1/food/1');
    expect(response.body.count).toEqual();
    expect(response.status).toEqual(200);
  });

  it('should UPDATE one from foods data', async () => {
    const response = await request.put('/api/v1/food/1').send({calories: 400});
    expect(response.status).toEqual(202);
  });

  it('should DELETE one from foods data', async () => {
    const response = await request.delete('/api/v1/food/1');
    expect(response.status).toEqual(204);
  });
});