const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { userController } = require("../controllers");

router.use(bodyParser.json());
router.use(express.json());

/**
 * @swagger
 * /api/user/get/{email}:
 *   get:
 *     summary: Retrieve user details by email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the user to retrieve
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       500:
 *         description: Error getting user details
 */
router.get("/get/:email", async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
    }

    const user = await userController.getUser(email);
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ user: user });
  } catch (error) {
    console.error(`Error getting a user: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/user/update/email:
 *   post:
 *     summary: Update user's email address
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated successfully
 *       500:
 *         description: Error updating email
 */
router.post("/update/email", async (req, res) => {
  try {
    const { email, newEmail } = req.body;
    if (!email || !newEmail) {
      res.status(400).json({ message: "Email and new email are required" });
    }

    const userData = await userController.getUser(email);
    const user = userData.dataValues;

    if (user.email !== email) {
      res.status(400).json({ message: "Email does not match" });
    }

    const response = await userController.updateEmail(email, newEmail);

    if (!response) {
      res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error(`Error updating email: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/user/update/password:
 *   post:
 *     summary: Update user's password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPasswordHash:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       500:
 *         description: Error updating password
 */
router.post("/update/password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      res.status(400).json({ message: "Email and new password are required" });
    }

    const response = await userController.updatePassword(
      email,
     newPassword 
    );
    if (!response) {
      res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(`Error updating password: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/user/update/username:
 *   post:
 *     summary: Update user's username
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               currentUsername:
 *                 type: string
 *               newUsername:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username updated successfully
 *       500:
 *         description: Error updating username
 */
router.post("/update/username", async (req, res) => {
  try {
    const { email, newUsername } = req.body;
    console.log(email, newUsername);
    if (!email | !newUsername) {
      res.status(400).json({ message: "Error! Email, current username, and new username are required" });
    }

    const response = await userController.updateUsername(
      email,
      newUsername
    );
    console.log(response);
    if (!response) {
      res.status(400).json({ message: "Error! User not found" });
    }

    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error(`Error updating username: ${error}`);
    res.status(500);
  }
});

module.exports = router;
