require("dotenv").config()
const mysql = require('mysql2')

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

async function getUser(email) {
    const [rows] = await connection.query(
        `SELECT *
        FROM Users
        WHERE Email = ?`,
        [email]
    );
    return rows[0];
}

async function createUser(username, email, passwordHash) {
    const [insertID] = await connection.query(
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
    const [categoriesRequest] = await connection.query(
        `SELECT CategoryID
        FROM Transactions
        WHERE UserID = ?`,
        [userID]
    );
    let categoriesID = [];
    for(let i = 0; i < categoriesRequest.length; i++) {
        categoriesID.push(categoriesRequest[i].CategoryID);
    }
    return categoriesID;
}

async function getCategoryNameByID(categoryID) {
    const [categoryNameRequest] = await connection.query(
        `SELECT CategoryName
        FROM Categories
        WHERE CategoryID = ?`,
        [categoryID]
    );
    const categoryNameJSON = categoryNameRequest[0];
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
    const [moneySpentObj] = await connection.query(
        `SELECT Amount
        FROM Transactions
        WHERE UserID = (?)`,
        [userID]
    );
    let moneySpent = [];
    for(let i = 0; i < moneySpentObj.length; i++) {
        moneySpent.push(moneySpentObj[i].Amount);
    }
    return moneySpent;
}

async function addTransaction(userID, amount, categoryID) {
    const [rows] = await connection.query(
        `INSERT INTO Transactions (UserID, Amount, CategoryID)
        VALUES (?, ?, ?);`,
        [userID, amount, categoryID]
    );
    return true;
}

async function getTotalSpent(userID) {
    const [totalSpentRequest] = await connection.query(
        `SELECT TotalSpent
        FROM Users
        WHERE UserID = (?)`,
        [userID]
    );
    return totalSpentRequest[0].TotalSpent;
}

async function updateTotalMoneySpentByUserID(userID, amount) {
    const totalSpentString = await getTotalSpent(userID);
    const totalSpent = parseFloat(totalSpentString);
    const updateAmount = parseFloat(amount);
    const updatedTotalSpent = totalSpent + updateAmount;
    const [rows] = await connection.query(
        `UPDATE Users
        SET TotalSpent = ?
        WHERE UserID = ?`,
        [updatedTotalSpent, userID]
    );
    return true;
}

module.exports = {
    getUser,
    createUser,
    loginUser,
    getCategoryNameByID,
    getTransactionCategoriesByUserID,
    getTransactionMoneyByUserID,
    addTransaction,
    getTotalSpent,
    updateTotalMoneySpentByUserID
};
