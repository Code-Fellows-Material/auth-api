'use strict';

const supertest = require('supertest');
const server = require('../lib/server.js').server;
const { users } = require('../lib/models/index.js');

const mockRequest = supertest(server);

beforeAll(async () => {
  await users.sync({ force: true })
});
afterAll(async () => {
  await users.drop();
});

let userInfo = {
  firstUser: { username: 'mya', password: 'test'},
};


// Pre-load our database with fake users
beforeAll( async (done) => {
  await users.create(userInfo.firstUser)
  done();
});


describe('Auth Tests', () => {

  it('signup client.', async (done) => {

    const response = await mockRequest.post('/signup').send(userInfo.firstUser);
    const userObject = response.body;

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userInfo.firstUser.username)
    done();
  }); 

  it('signin client', async (done) => {

    const response = await mockRequest.post('/signin')
      .auth(userInfo.firstUser.username, userInfo.firstUser.password);
    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.username).toEqual(userInfo.firstUser.username)
    done();
  });

});
