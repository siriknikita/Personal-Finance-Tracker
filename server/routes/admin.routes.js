const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const service = require("../services/userService");
const { getTotalUsersSpending } = require("../services/transactionService");

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
    const users = await service.getUsers();
    res.json({ users: users });
  } catch (error) {
    console.error(`Error getting users: ${error}`);
    res.status(500);
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
    const usersSpending = await getTotalUsersSpending();
    res.json({ usersSpending: usersSpending });
  } catch (error) {
    console.error(`Error getting users spending: ${error}`);
    res.status(500);
  }
});

module.exports = router;
