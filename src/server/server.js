require("dotenv").config({ path:"../../.env" });
const database = require('./database.js')
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const app = express();

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
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

// Handle user's signing up
app.post("/api/signup", async (req, res) => {
	const { username, email, passwordHash } = req.body;

	try {
		const user = await database.getUser(email);
		if (user) {
			res.status(400).send({ error: "email already taken" });
			return;
		}
		const userID = await database.createUser(username, email, passwordHash);
		res.send({ userID });
	} catch (error) {
		console.error(`Error signing up: ${error}`);
		res.status(500);
		return;
	}
});

// Handle user's loggin in
app.post("/api/login", async (req, res) => {
	const { email, passwordHash } = req.body;

	try {
		const canLogin = await database.loginUser(email, passwordHash);
		if (canLogin) {
			res.status(200).send(true);
		} else {
			console.log('Cannot login a user');
			res.status(400).send(false);
		}
	} catch (error) {
		console.error(`Error logging in user: ${error}`);
		res.status(500);
		return;
	}
});

// Get user by email
app.get("/api/get/user/email/:email", async (req, res) => {
	const email = req.params.email;
	
	try {
		const user = await database.getUser(email);
		if (!user) {
			res.status(400).send({ error: "No user was found with given email" })
			return;
		} else {
			res.status(200).send({ user: user });
		}
	} catch (error) {
		console.error(`Error getting a user: ${error}`);
		res.status(500);
		return;
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
		return;
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
	console.log(`UserID passed: ${userID}`);
	console.log(`Current categoryID passed: ${currentCategoryID}`);
	console.log(`Current amount passed: ${currentAmount}`);
	const response = await database.addTransaction(userID, currentAmount, currentCategoryID);
	res.status(201).send(response);
});

// Get category name by ID
app.get("/api/get/categoryName/:categoryID", async (req, res) => {
	const categoryID = req.params.categoryID;

	try {
		const categoryName = await database.getCategoryNameByID(categoryID);
		res.status(200).send({ categoryName });
	} catch (error) {
		console.error(`Error getting a category name: ${error}`);
		res.status(500);
		return;
	}
});

app.post("/api/update/totalSpent/", async (req, res) => {
	const { userID, amount } = req.body;

	console.log(`Amount passed to totalSpent function:`);
	console.log(amount);
    const values = await database.updateTotalMoneySpentByUserID(userID, amount);
    const response = values[0];
    const toAddValue = values[1];
	res.send({ response: response, toAddValue: toAddValue });
});

// A request for testing
app.get("/api/test/userAuth/email/:Email/password/:Password", async (req, res) => {
	const email = req.params.Email;
	const password = req.params.Password;

	const specialSymbols = "-";
	
	if (passwordString.length < 12 &&
		!passwordString.includes(specialSymbols) &&
		!emailString.includes("@")
		) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(false);
			}, 100);
		})
	} else {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, 100);
		})
	}
});

app.use("/auth", authRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
