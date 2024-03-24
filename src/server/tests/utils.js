require("dotenv").config();

function fetchAuthData (email, password) {
    return new Promise((resolve, reject) => {
        fetch(`${process.env.REACT_APP_API_URL}/api/test/userAuth/email/${email}/password/${password}`)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                console.error("Error retrieving data:", error);
                reject(error); // reject the promise with the error
            });
    });
};

module.exports = fetchAuthData
