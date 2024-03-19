require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require('./db')
const bodyParser = require("body-parser")
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
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

app.post("/api/signup", (req, res) => {
	const { username, email, passwordHash } = req.body;

	db.query(
		"INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)",
		[username, email, passwordHash],
		(error, result) => {
			if (error) {
				console.error("Error signing up user:", error);
				res.status(500).json({ error: "Internal server error" });
				return;
			}
			console.log("User signed up successfully!");
			res.status(200).json({ message: "User signed up successfully!" });
		}
	);
});

app.post("/api/login", (req, res) => {
	const { email, passwordHash } = req.body;

	db.query(
		"SELECT count(?) AS count FROM Users WHERE Email=(?) AND PasswordHash=(?)",
		[email, email, passwordHash],
		(error, result) => {
			if (error) {
				console.error("Error signing up user:", error);
				res.status(500).json({ error: "Internal server error" });
				return;
			}
			if (result[0]["count"] == 1) {
				console.log("User logged in successfully!");
				res.status(200).json({ message: "User logged in successfully!" });
			} else {
				console.error("No user was found!");
				res.status(500).json({ error: "User not found error!" });
				return;
			}
		}
	);
});

app.get("/api/get_user/email/:userEmail", (req, res) => {
    const parseObj = JSON.stringify(req.params);
	const email = JSON.parse(parseObj)['userEmail'];
	
	db.query(
        "SELECT * FROM Users WHERE Email = (?)",
        [email],
        (error, result) => {
            if (error) {
                console.error("Error getting a user:", error);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
			if (result) {
                console.log("User found successfully!");
				const userObj = JSON.stringify(result[0]);
				const user = JSON.parse(userObj);
				res.send(user);
            } else {
                console.error("No user was found!");
                res.status(404).json({ error: "User not found error!" });
            }
        }
    );
});

app.get("/api/get_data/userID/:userID/transactions", (req, res) => {
	const parseObj = JSON.stringify(req.params);
	const userIDString = JSON.parse(parseObj)['userID'];
	const userID = parseInt(userIDString, 10);

	db.query(
		"SELECT TransactionID, Amount, CategoryID FROM Transactions WHERE UserID = (?)",
		[userID],
		(error, result) => {
			if (error) {
				console.error("Error getting a data about transaction:", error);
				res.status(500).json({ error: "Internal server error" });
				return;
			}
			if (result) {
				console.log("Transaction obtained successfully!");
				res.send(result);
			} else {
				console.error("No transaction was fonud!");
				res.status(404).json({ error: "No transaction was found!" });
			}
		}
	);
});


app.post("/api/add/transaction", (req, res) => {
	const { userID, currentAmount, currentCategoryID } = req.body;
	
	db.query(
		"INSERT INTO Transactions(UserID, Amount, CategoryID) VALUES (?, ?, ?)",
		[userID, currentAmount, currentCategoryID],
		(error, result) => {
			if (error) {
				console.error("Error adding a new transaction:", error);
				res.status(500).json({ error: "Internal server error" });
				return;
			}
			if (result) {
				console.log("Transaction added successfully!");
				res.status(200).json({ message: "Transaction added successfully!" });
			} else {
				console.error("No transaction was fonud!");
				res.status(500).json({ error: "No transaction was found!" });
				return;
			}
		}
	);
});

app.use("/auth", authRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
