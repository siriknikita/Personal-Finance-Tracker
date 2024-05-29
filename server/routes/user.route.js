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
    const email = req.params.email;

    const user = await userController.getUser(email);
    res.json({ user: user });
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

    const response = await userController.updateEmail(email, newEmail);
    if (response) {
      res.json({ message: "Email updated successfully" });
    }
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
    const { email, newPasswordHash } = req.body;

    const response = await userController.updatePassword(
      email,
      newPasswordHash
    );
    if (response) {
      res.json({ message: "Password updated successfully" });
    }
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
    const { email, currentUsername, newUsername } = req.body;

    const response = await userController.updateUsername(
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
