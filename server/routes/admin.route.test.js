const request = require("supertest");
const app = require("../server");

describe("Admin Route", () => {
  it("GET /api/admin/get/users", async () => {
    await request(app).get("/api/admin/get/users").expect(401);
  });

  it("GET /api/admin/get/usersSpending", async () => {
    await request(app).get("/api/admin/get/usersSpending").expect(401);
  });
});
