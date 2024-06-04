const {
  extractPasswordFromEmail,
  extractUsernameFromEmail,
} = require("./auth.js");

describe("extractPasswordFromEmail", () => {
  it("should extract the password from the email", () => {
    const email = "greykydd@gmail.com";
    const password = extractPasswordFromEmail(email);
    expect(password).toBe("gmail");
  });

  it("should return an empty string if the email does not contain a password", () => {
    const email = "jane.doe@";
    const password = extractPasswordFromEmail(email);
    expect(password).toBe("");
  });
});

describe("extractUsernameFromEmail", () => {
  it("should extract the username from the email", () => {
    const email = "john.doe@example.com";
    const username = extractUsernameFromEmail(email);
    expect(username).toBe("john.doe");
  });

  it('should return the full email if it does not contain an "@" symbol', () => {
    const email = "johndoeexample.com";
    const username = extractUsernameFromEmail(email);
    expect(username).toBe("johndoeexample.com");
  });
});
