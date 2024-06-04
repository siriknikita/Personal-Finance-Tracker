const {
  formatMoneySpentData,
  getMoneySpent,
  getUsersSpending,
} = require("./categories");

describe("formatMoneySpentData", () => {
  it("should format the money spent data correctly", () => {
    const data = {
      "Food & Drinks": 50,
      Transport: 20,
      Shopping: 30,
    };
    const formattedData = formatMoneySpentData(data);
    expect(formattedData).toEqual([
      { name: "Food & Drinks", value: 50 },
      { name: "Transport", value: 20 },
      { name: "Shopping", value: 30 },
    ]);
  });
});

describe("getMoneySpent", () => {
  it("should fetch and return the money spent by a user", async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 100 }));

    const userID = 2;
    const moneySpent = await getMoneySpent(userID);
    expect(moneySpent).toBe(100);
  });
});

describe("getUsersSpending", () => {
  it("should fetch and return the spending data of all users", async () => {
    fetch.mockResponseOnce(JSON.stringify({ usersSpending: [1, 2, 3] }));

    const usersSpending = await getUsersSpending();
    expect(usersSpending).toEqual([1, 2, 3]);
  });
});
