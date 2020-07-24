const supertest = require("supertest");

const server = require("./server.js");

describe("server", function () {
  it("runs the tests", function () {
    expect(true).toBe(true);
  });

  describe("GET /", function () {
    it("should respond with 200 OK", function () {
      return supertest(server)
        .get("/")
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });

    it("should respond with JSON", function () {
      return supertest(server)
        .get("/")
        .then((res) => {
          expect(res.type).toMatch(/json/i);
        });
    });

    it("should respond with api: 'up'", function () {
      return supertest(server)
        .get("/")
        .then((res) => {
          expect(res.body.api).toBe("up");
        });
    });
  });
});
