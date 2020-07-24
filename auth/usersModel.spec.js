/*
testing the insert manually.

- make sure the data is not on the table (clean tables before each test)
- insert the data
- check that the data is in the table

*/
const db = require("../database/dbConfig");
const Users = require("../auth/auth-model");

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
});
