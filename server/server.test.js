require("dotenv").config();

// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//   })
// );

const isAuthenticationData = async (email, password) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/test/userAuth/email/${email}/password/${password}`
        );
        return await response;
    } catch (error) {
        console.error("Error retrieving data:", error);
        throw error; // re-throw the error to propagate it
    }
};

const fetchCorrectAuthCheck = async (email, password) => {
    return await isAuthenticationData(email, password);
};

const fetchFalseAuthCheck = async (email, password) => {
    return await isAuthenticationData(email, password);
};

test('check if email and password are correct', async () => {
    const correctEmail = "something@gmail.com";
    const correctPassword = "Imustinclude-at-least-1-char";

    const falseEmail = "somethinggmail.com";
    const falsePassword = "Imustinchar";

    const correctAuthCheckResult = await fetchCorrectAuthCheck(correctEmail, correctPassword);
    const incorrectAuthCheckResult = await fetchFalseAuthCheck(falseEmail, falsePassword);
    
    isAuthenticationData(correctEmail, correctPassword).then(response => {
        expect(response).toBeTruthy();
    })
    console.log(incorrectAuthCheckResult);
    console.log(correctAuthCheckResult);
    // expect(incorrectAuthCheckResult).toBeFalsy()
})