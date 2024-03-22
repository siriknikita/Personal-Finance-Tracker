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

async function getUserIDByEmail(email) {
    const [rows] = await connection.promise().query(
        `SELECT UserID
        FROM Users
        WHERE Email=(?)`,
        [email]
    );
    return rows[0]['UserID'];
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

async function getTransactionCategoriesIDByEmail(email) {
    const userID = await getUserIDByEmail(email);
    const categoriesObj = await connection.promise().query(
        `SELECT CategoryID
        FROM Transactions
        WHERE UserID = (?)`,
        [userID]
    );
    const categoriesJSON = categoriesObj[0];
    let categoriesID = [];
    for(let i = 0; i < categoriesJSON.length; i++) {
        categoriesID.push(categoriesJSON[i]['CategoryID']);
    }
    return categoriesID;
}

async function getCategoryNameByID(categoryID) {
    const categoryNameObj = await connection.promise().query(
        `SELECT CategoryName
        FROM Categories
        WHERE CategoryID=(?)`,
        [categoryID]
    );
    const categoryNameJSON = categoryNameObj[0][0];
    return categoryNameJSON['CategoryName'];
}

async function getTransactionCategoriesByEmail(email) {
    const categoriesID = await getTransactionCategoriesIDByEmail(email);
    let categoriesList = [];
    for(let i = 0; i < categoriesID.length; i++) {
        const categoryName = await getCategoryNameByID(categoriesID[i]);
        categoriesList.push(categoryName);
    }
    return categoriesList;
}

async function getTransactionMoneyByEmail(email) {
    const userID = await getUserIDByEmail(email);
    const moneySpentObj = await connection.promise().query(
        `SELECT Amount
        FROM Transactions
        WHERE UserID = (?)`,
        [userID]
    );
    const moneySpentJSON = moneySpentObj[0];
    let moneySpent = [];
    for(let i = 0; i < moneySpentJSON.length; i++) {
        moneySpent.push(moneySpentJSON[i]['Amount']);
    }
    return moneySpent;
}

async function addTransaction(email, amount, categoryID) {
    const userID = await getUserIDByEmail(email);
    const [rows] = await connection.promise().query(
        `INSERT INTO 
        Transactions(UserID, Amount, CategoryID) 
        VALUES (?, ?, ?)`,
        [userID, amount, categoryID]
    );
    return true;
}

module.exports = {
    getUser,
    createUser,
    loginUser,
    getCategoryNameByID,
    getTransactionCategoriesByEmail,
    getTransactionMoneyByEmail,
    addTransaction
};
