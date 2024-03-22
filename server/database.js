require("dotenv").config()
const mysql = require('mysql2')

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function getUser(email) {
    const [rows] = await connection.promise().query(
        `SELECT *
        FROM Users
        WHERE Email=(?)`,
        [email]
    );
    return rows[0];
}

async function createUser(username, email, passwordHash) {
    const { insertID } = await connection.promise().query(
        `INSERT INTO Users (Username, Email, PasswordHash) 
        VALUES (?, ?, ?)`,
        [username, email, passwordHash]
    );
    return insertID;
}

async function loginUser(email, password) {
    const user = await getUser(email);
    return user.PasswordHash == password;
}

async function getTransactionCategoriesIDByUserID(userID) {
    const categoriesRequest = await connection.promise().query(
        `SELECT CategoryID
        FROM Transactions
        WHERE UserID = (?)`,
        [userID]
    );
    const categoriesJSON = categoriesRequest[0];
    let categoriesID = [];
    for(let i = 0; i < categoriesJSON.length; i++) {
        categoriesID.push(categoriesJSON[i].CategoryID);
    }
    return categoriesID;
}

async function getCategoryNameByID(categoryID) {
    const categoryNameRequest = await connection.promise().query(
        `SELECT CategoryName
        FROM Categories
        WHERE CategoryID=(?)`,
        [categoryID]
    );
    const categoryNameJSON = categoryNameRequest[0][0];
    return categoryNameJSON.CategoryName;
}

async function getTransactionCategoriesByUserID(userID) {
    const categoriesID = await getTransactionCategoriesIDByUserID(userID);
    let categoriesList = [];
    for(let i = 0; i < categoriesID.length; i++) {
        const categoryName = await getCategoryNameByID(categoriesID[i]);
        categoriesList.push(categoryName);
    }
    return categoriesList;
}

async function getTransactionMoneyByUserID(userID) {
    const moneySpentObj = await connection.promise().query(
        `SELECT Amount
        FROM Transactions
        WHERE UserID = (?)`,
        [userID]
    );
    const moneySpentJSON = moneySpentObj[0];
    let moneySpent = [];
    for(let i = 0; i < moneySpentJSON.length; i++) {
        moneySpent.push(moneySpentJSON[i].Amount);
    }
    return moneySpent;
}

async function addTransaction(userID, amount, categoryID) {
    const [rows] = await connection.promise().query(
        `INSERT INTO 
        Transactions(UserID, Amount, CategoryID) 
        VALUES (?, ?, ?)`,
        [userID, amount, categoryID]
    );
    return true;
}

async function getTotalSpent(userID) {
    const totalSpentRequest = await connection.promise().query(
        `SELECT TotalSpent
        FROM Users
        WHERE UserID = (?)`,
        [userID]
    );
    const totalSpentJSON = totalSpentRequest[0][0];
    console.log('TotalSpentJSON:');
    console.log(totalSpentJSON);
    return totalSpentJSON.TotalSpent;
}

async function updateTotalMoneySpentByUserID(userID, amount) {
    const totalSpentResponse = await getTotalSpent(userID);
    const totalSpent = parseInt(totalSpentResponse, 10);
    const toAdd = totalSpent + amount;
    // console.log(`Passed amount: ${amount}`);
    // console.log(`To add: ${toAdd}`);
    // console.log(`Passed UserID: ${userID}`);
    const [rows] = await connection.promise().query(
        `UPDATE Users
        SET TotalSpent = (?)
        WHERE UserID = (?)`,
        [toAdd, userID]
    );
    return [true, toAdd];
}

module.exports = {
    getUser,
    createUser,
    loginUser,
    getCategoryNameByID,
    getTransactionCategoriesByUserID,
    getTransactionMoneyByUserID,
    addTransaction,
    updateTotalMoneySpentByUserID
};
