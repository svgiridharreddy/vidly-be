const request = require('supertest');
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');

describe("auth middleware", () => {
  let server;
  beforeEach(() => {
    server = require('../../index');
  })

  afterEach( async () => {
    server.close();
    await Genre.deleteMany()
  })

  let token;

  beforeEach(() => {
    token = new User().generateAuthToken();
  })

  const exec = () => {
    return request(server)
    .post('/api/genres')
    .set('x-auth-token', token)
    .send({
      name: 'genre1'
    })
  }


  it("should return 401 if no token is passed", async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  })

  it("should return 400 if no token is passed", async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  })

  it("should return 200 if valid token is passed", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  })

})