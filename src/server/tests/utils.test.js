const validateLogin = require("./utils")

describe('Test validateLogin function', () => {
    test('should validate successfully', () => {
        const email = 'test@example.com';
        const password = 'password1231-123-12-1-12';
        const result = validateLogin(email, password);
        expect(result).toBeTruthy();
    });
    test("should validate falsy", () => {
        const email = "test";
        const password = "password213";
        const result = validateLogin(email, password);
        expect(result).toBeFalsy();
    });
});
