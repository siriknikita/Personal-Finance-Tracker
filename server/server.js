require("dotenv").config();
const database = require('./database.js')
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
// const passportStrategy = require("./passport");
const app = express();

app.use(
	cookieSession({
		name: "session",
		keys: ["siryk"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

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

app.get("/api/get/user/email/:email", async (req, res) => {
    const parseObj = JSON.stringify(req.params);
	const email = JSON.parse(parseObj)['email'];
	
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

app.get("/api/get/transactions/categories/:email", async (req, res) => {
	const parseObj = JSON.stringify(req.params);
	const email = JSON.parse(parseObj)['email'];

	try {
		const categories = await database.getTransactionCategoriesByEmail(email);
		res.send(categories);
		return categories;
	} catch (error) {
		console.error(`Error getting a categories: ${error}`);
		res.status(500);
		return;
	}
});

app.get("/api/get/transactions/moneySpent/:email", async (req, res) => {
	const parseObj = JSON.stringify(req.params);
	const email = JSON.parse(parseObj)['email'];

	try {
		const moneySpent = await database.getTransactionMoneyByEmail(email);
		res.send(moneySpent);
		return moneySpent;
	} catch (error) {
		console.error(`Error getting a money spent: ${error}`);
		res.status(500);
		return;
	}
});

app.post("/api/add/transaction", async (req, res) => {
	const { email, currentAmount, currentCategoryID } = req.body;
	const response = await database.addTransaction(email, currentAmount, currentCategoryID);
	console.log(response);
	res.send(response);
});

app.get("/api/get/categoryName/:categoryID", async (req, res) => {
	const parseObj = JSON.stringify(req.params);
	const categoryID = JSON.parse(parseObj)['categoryID'];

	try {
		const categoryName = await database.getCategoryNameByID(categoryID);
		res.status(200).send({ categoryName });
	} catch (error) {
		console.error(`Error getting a category name: ${error}`);
		res.status(500);
		return;
	}
});

app.get("/api/test/userAuth/email/:Email/password/:Password", (req, res) => {
	const parseObj = JSON.stringify(req.params);
	const emailString = JSON.parse(parseObj)['Email'];
	const passwordString = JSON.parse(parseObj)['Password'];

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
