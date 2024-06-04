const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { userController, transactionController } = require("../controllers");

router.use(bodyParser.json());
router.use(express.json());

/**
 * @swagger
 * /api/admin/get/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Error getting users
 */
router.get("/get/users", async (req, res) => {
  try {
    const users = await userController.getUsers();
    res.json({ users: users });
  } catch (error) {
    console.error(`Error getting users: ${error}`);
    res.status(500).send("Error getting users");
  }
});

/**
 * @swagger
 * /api/admin/get/usersSpending:
 *   get:
 *     summary: Retrieve total spending for all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Total spending retrieved successfully
 *       500:
 *         description: Error getting total spending
 */
router.get("/get/usersSpending", async (req, res) => {
  try {
    const usersSpending = await transactionController.getTotalUsersSpending();
    res.json({ usersSpending: usersSpending });
  } catch (error) {
    console.error(`Error getting users spending: ${error}`);
    res.status(500).send("Error getting users spending");
  }
});

module.exports = router;
