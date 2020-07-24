/*
testing the insert manually.

- make sure the data is not on the table (clean tables before each test)
- insert the data
- check that the data is in the table

*/
const db = require("../database/dbConfig");
const Users = require("./auth-model");
const server = require("../api/server");
const supertest = require("supertest");
const { request } = require("../api/server");

describe("environment", function () {
  it("should be using the testing database", function () {
    expect(process.env.DB_ENV).toBe("testing");
  });
});

describe("auth model", function () {
  describe("insert()", function () {
    beforeEach(async () => {
      await db("users").truncate();
    });

    it("should insert users into database", async () => {
      // table was cleared by the beforeEach() function
      await Users.add({ username: "wei-peluso", password: "abcdefg" });
      await Users.add({ username: "suzie-peluso", password: "abcdefg" });

      const users = await db("users");

      expect(users).toHaveLength(2);
    });
  });

  it("./register sucess", () => {
    supertest(server)
      .post("localhost:3300/api/auth/register")
      .send({
        username: "Testing",
        password: "Testing",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  it("./register fails with empty password", () => {
    supertest(server)
      .post("localhost:3300/api/auth/register")
      .send({
        username: "Testing",
      })
      .expect("Content-Type", /json/)
      .expect(500)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  it("./login sucess", () => {
    supertest(server)
      .post("localhost:3300/api/auth/login")
      .send({
        username: "Testing",
        password: "Testing",
      })
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });

  it("./login fails with wrong password", () => {
    supertest(server)
      .post("localhost:3300/api/auth/lgoin")
      .send({
        username: "Testing",
        password: "1",
      })
      .expect("Content-Type", /json/)
      .expect(500)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  });
});
