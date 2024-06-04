const request = require("supertest");
const app = require("../server");

describe("Auth Route", () => {
  it("POST /api/auth/register", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "new_user",
      email: "new_user@gmail.com",
      passwordHash: "new_user",
      isGoogle: false,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("User already exists");
  });

  it("POST /api/auth/login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "new_user@email.com",
      passwordHash: "my_password",
      isGoogle: false,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("POST /api/auth/me", async () => {
    const res = await request(app).post("/api/auth/me");
    expect(res.statusCode).toEqual(404);
  });
});
