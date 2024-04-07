const database = require('./database.js')
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const passport = require("passport");
const authRoute = require("./routes/auth.js");
const cookieSession = require("cookie-session");
const app = express();
require("dotenv").config({ path: "./.env" });

// Initialize new cookie session
app.use(
	cookieSession({
		name: "session",
		keys: ["siryk"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

// Initialize instruments for parsing and correct server's work
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

// Define default values of usage
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

// Handle user's signing up
app.get("/api/signup/:username/:email/:password", async (req, res) => {
	const username = req.params.username;
	const email = req.params.email;
	const password = req.params.password;

	try {
		const user = await database.getUser(email);
		if (user) {
			res.status(400).send({ error: "User with given email already exists" });
			return;
		}
		console.log("User was not found");
		const response = await database.createUser(username, email, password);
		res.send({ response });
	} catch (error) {
		console.error(`Error signing up: ${error}`);
		res.status(500);
	}
});

app.get("/api/login/:email/:password", async (req, res) => {
	const email = req.params.email;
	const password = req.params.password;

	console.log(email, password);

	try {
		const user = await database.getUser(email);
		if (!user) {
			res.status(400).send({ error: "No user was found with given email..." });
			return;
		}
		console.log("User was found");
		const isPasswordCorrect = user.PasswordHash == password;
		if (!isPasswordCorrect) {
			res.status(400).send({ error: "Password is incorrect" });
			return;
		}
		console.log("Password is correct");
		res.send({ user });
	} catch (error) {
		console.error(`Error logging in: ${error}`);
		res.status(500);
	}
});

// Get user by email
app.get("/api/get/user/email/:email", async (req, res) => {
	const email = req.params.email;
	
	try {
		const user = await database.getUser(email);
		if (!user) {
			res.status(400).send({ error: "No user was found with given email" })
		}
		res.send({ user: user });
	} catch (error) {
		console.error(`Error getting a user: ${error}`);
		res.status(500);
		return;
	}
});

// Get all transactions by userID
app.get("/api/get/transactions/:userID", async (req, res) => {
	const userID = req.params.userID;

	try {
		const transactions = await database.getTransactionsByID(userID);
		res.send(transactions);
	} catch (error) {
		console.error(`Error getting a transactions: ${error}`);
		res.status(500);
	}
});

// Get user's transaction categories by userID
app.get("/api/get/transactions/categories/:userID", async (req, res) => {
	const userID = req.params.userID;

	try {
		const categories = await database.getTransactionCategoriesByUserID(userID);
		res.send(categories);
	} catch (error) {
		console.error(`Error getting a categories: ${error}`);
		res.status(500);
	}
});

// Get user's transaction money spent by userID
app.get("/api/get/transactions/moneySpent/:userID", async (req, res) => {
	const userID = req.params.userID;

	try {
		const moneySpent = await database.getTransactionMoneyByUserID(userID);
		res.send(moneySpent);
	} catch (error) {
		console.error(`Error getting a money spent: ${error}`);
		res.status(500);
	}
});

// Add a transaction to the database
app.post("/api/add/transaction", async (req, res) => {
	const { userID, currentAmount, currentCategoryID } = req.body;
	const response = await database.addTransaction(userID, currentAmount, currentCategoryID);
    const updateResponse = await database.updateTotalMoneySpentByUserID(userID, currentAmount);
	res.status(201).send(response && updateResponse);
});

// Get category name by ID
app.get("/api/get/categoryName/:categoryID", async (req, res) => {
	const categoryID = req.params.categoryID;

	try {
		const categoryName = await database.getCategoryNameByID(categoryID);
		res.send({ categoryName });
	} catch (error) {
		console.error(`Error getting a category name: ${error}`);
		res.status(500);
		return;
	}
});

// Get total spent
app.get("/api/get/totalSpent/:userID", async (req, res) => {
	const userID = req.params.userID;

	try {
		const totalSpent = await database.getTotalSpent(userID);
		res.send({ totalSpent });
	} catch (error) {
		console.error(`Error getting a category name: ${error}`);
		res.status(500);
	}
});

// Update total spent value
app.post("/api/update/totalSpent", async (req, res) => {
	const { userID, amount } = req.body;
    const response = await database.updateTotalMoneySpentByUserID(userID, amount);
	res.send(response);
});

app.use("/auth", authRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
