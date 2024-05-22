const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const service = require("../services/userService");
const { getTotalUsersSpending } = require("../services/transactionService");

router.use(bodyParser.json());
router.use(express.json());

router.get("/get/users", async (req, res) => {
  try {
    const users = await service.getUsers();
    res.json({ users: users });
  } catch (error) {
    console.error(`Error getting users: ${error}`);
    res.status(500);
  }
});

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
