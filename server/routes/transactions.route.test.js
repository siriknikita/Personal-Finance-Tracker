const request = require("supertest");
const app = require("../server");

describe("Transactions Route", () => {
  it("GET /api/transactions/get/{userID}", async () => {
    await request(app).get("/api/transactions/get/1").expect(401);
  });

  it("GET /api/transactions/get/moneySpent/{userID}", async () => {
    await request(app).get("/api/transactions/get/moneySpent/1").expect(401);
  });

  it("GET /api/transactions/get/moneySpent/categories/{userID}", async () => {
    await request(app).get("/api/transactions/get/moneySpent/categories/1").expect(401);
  });

  it("GET /api/transactions/get/spendings/top5", async () => {
    await request(app).get("/api/transactions/get/spendings/top5").expect(401);
  });

  it("GET /api/transactions/get/categories/{userID}", async () => {
    await request(app).get("/api/transactions/get/categories/{userID}").expect(401);
  });

  it("POST /api/transactions/add", async () => {
    await request(app).post("/api/transactions/add").expect(401);
  });
});
