require("dotenv").config()
const mysql = require('mysql2')

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

class User {
    constructor(userID, username, email, passwordHash, totalSpent, weeklySpnet) {
        this.userID = userID;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.totalSpent = totalSpent;
        this.weeklySpnet = weeklySpnet;
    }
}