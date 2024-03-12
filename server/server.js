require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require('./db')
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
	const { username, email, password } = req.body;

	db.query(
		"INSERT INTO Users (Username, Email, PasswordHash) VALUES (?, ?, ?)",
		[username, email, password],
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

app.use("/auth", authRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
