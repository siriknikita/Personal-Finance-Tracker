const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const database = require("../database");

router.use(bodyParser.json());
router.use(express.json());

router.get("/get/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await service.getUser(email);
    res.json({ user: user });
  } catch (error) {
    console.error(`Error getting a user: ${error}`);
    res.status(500);
  }
});

router.post("/update/email", async (req, res) => {
  try {
    const email = req.body.email;
    const newEmail = req.body.newEmail;

    const response = await service.updateEmail(email, newEmail);
    if (response) {
      res.json({ message: "Email updated successfully" });
    }
  } catch (error) {
    console.error(`Error updating email: ${error}`);
    res.status(500);
  }
});

router.post("/update/password", async (req, res) => {
  try {
    const email = req.body.email;
    const newPasswordHash = req.body.newPasswordHash;
    const response = await service.updatePassword(email, newPasswordHash);
    if (response) {
      res.json({ message: "Password updated successfully" });
    }
  } catch (error) {
    console.error(`Error updating password: ${error}`);
    res.status(500);
  }
});

router.post("/update/username", async (req, res) => {
  try {
    const email = req.body.email;
    const currentUsername = req.body.currentUsername;
    const newUsername = req.body.newUsername;

    const response = await service.updateUsername(
      email,
      currentUsername,
      newUsername
    );
    if (response) {
      res.json({ message: "Username updated successfully" });
    }
  } catch (error) {
    console.error(`Error updating username: ${error}`);
    res.status(500);
  }
});

module.exports = router;
