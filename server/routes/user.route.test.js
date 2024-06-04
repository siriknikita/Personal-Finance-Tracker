const request = require("supertest");
const app = require("../server");

describe("User Route", () => {
  it("GET /api/user/get/{email}", async () => {
    await request(app).get("/api/user/get/new_user@gmail.com").expect(401);
  });

  it("POST /api/user/update/email", async () => {
    await request(app)
      .post("/api/user/update/email")
      .send({
        email: "new_user@gmail.com",
        newEmail: "new_user@gmail.com",
      })
      .expect(401);
  });

  it("POST /api/user/update/password", async () => {
    await request(app)
      .post("/api/user/update/password")
      .send({
        email: "new_user@gmail.com",
        newPasswordHash: "new_user",
      })
      .expect(401);
  });

  it("POST /api/user/update/username", async () => {
    await request(app)
      .post("/api/user/update/username")
      .send({
        email: "new_user@gmail.com",
        currentUsername: "new_user",
        newUsername: "new_user",
      })
      .expect(401);
  });
});
