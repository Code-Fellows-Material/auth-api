'use strict';

const server = require('../lib/server.js').server;
const supertest = require('supertest');
const request = supertest(server);
const { users } = require('../lib/models/index.js');

const { db } = require('../lib/models/index.js');



beforeAll(async () => {
  await users.sync({ force: true })
  await db.sync();
});

afterAll(async () => {
  await users.drop();
  await db.drop();
});

let testUsers = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
};


// Pre-load our database with fake users
beforeAll( async (done) => {
  await users.create(testUsers.admin)
  done();
});



describe('Testing the AUTHORIZED food router', () => {

  it('signin', async (done) => {

    const response = await request.post('/signin')
    .auth(testUsers.admin.username, testUsers.admin.password);
    
    expect(response.body.token).toBeDefined();
    expect(response.status).toEqual(200);
    done();
  }); 

  it('should CREATE one from foods data', async () => {
    const response = await request.post('/signin')
    .auth(testUsers.admin.username, testUsers.admin.password);

    const token = response.body.token;

    const bearerResponse = await request
    .post('/api/v2/food').send({food: "banana", calories: 4, type: 'fruit'})
    .set('Authorization', `Bearer ${token}`);
    expect(bearerResponse.body).toBeDefined();
    expect(bearerResponse.status).toEqual(201);
  });

  it('should read ALL from foods data', async () => {
    const response = await request.post('/signin')
    .auth(testUsers.admin.username, testUsers.admin.password);

    const token = response.body.token;

    const bearerResponse = await request
    .get('/api/v2/food')
    .set('Authorization', `Bearer ${token}`);
    
    expect(bearerResponse.body).toBeDefined();
    expect(bearerResponse.status).toEqual(200);
  });

  it('should read ONE from foods data', async () => {
    const response = await request.post('/signin')
    .auth(testUsers.admin.username, testUsers.admin.password);

    const token = response.body.token;

    const bearerResponse = await request
    .get('/api/v2/food/1')
    .set('Authorization', `Bearer ${token}`);

    expect(bearerResponse.body).toBeDefined();
    expect(bearerResponse.status).toEqual(200);
  });

  it('should UPDATE one from foods data', async () => {
    const response = await request.post('/signin')
    .auth(testUsers.admin.username, testUsers.admin.password);

    const token = response.body.token;

    const bearerResponse = await request
    .put('/api/v2/food/1').send({calories: 400})
    .set('Authorization', `Bearer ${token}`);

    expect(bearerResponse.status).toEqual(202);
  });

  it('should DELETE one from foods data', async () => {
    const response = await request.post('/signin')
    .auth(testUsers.admin.username, testUsers.admin.password);

    const token = response.body.token;

    const bearerResponse = await request
    .delete('/api/v2/food/1')
    .set('Authorization', `Bearer ${token}`);
    expect(bearerResponse.status).toEqual(204);
  });
});