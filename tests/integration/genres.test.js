const request = require('supertest');
const mongoose = require('mongoose');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
let server; 

describe("/api/genres", () => {

  beforeEach(() => {server = require('../../index');});
  afterEach(async () => {
    server.close();
    await Genre.deleteMany()
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        {name: "genre1"},
        {name: "genre2"},
      ])
      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.genres.length).toBe(2);
      expect(res.body.genres.some(g => g.name === "genre1")).toBeTruthy();
      expect(res.body.genres.some(g => g.name === "genre2")).toBeTruthy();
    })
  })

  describe("Get /:id", () => {
    it("should return genre if valid id is passed", async() => {
      const genre = new Genre({name: "genre1"});
      await genre.save()
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body.genre).toHaveProperty('name', genre.name);
    })

    it("should return 404 if invalid id is passed", async() => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    })

    it("should return 404 if genere doesn't exist with given id", async() => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    })
  })

  describe("POST /", () => {

    let token; 
    let name
    const exec = async () => {
      return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name='genre1';
    })

    it("should return 401 if client is not logged in", async () => {
      token='';
      const res = await request(server).post("/api/genres").send({name: "genre1"});
      expect(res.status).toBe(401);
    })

    it("should return 400 if invalid genre is less than 5 characters", async () => {
      name='asd';
      const res = await exec();
      expect(res.status).toBe(400);
    })

    it("should return 400 if invalid genre is more than 50 characters", async () => {
      name = new Array(52).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save genre if it is valid", async () => {
      const res = await exec();
      const genre = Genre.find({name: 'genre1'});
      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });

    it("should return genre if it is valid", async () => {
      const res = await exec();

      expect(res.body.genre).toHaveProperty('_id');
      expect(res.body.genre).toHaveProperty('name','genre1');
    });

  })
})