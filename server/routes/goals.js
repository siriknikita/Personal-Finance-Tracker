const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const service = require("../services/goalService");

router.use(bodyParser.json());
router.use(express.json());

router.get("/get/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;

    const goals = await service.getGoals(userID);
    res.json({ goals: goals });
  } catch (error) {
    console.error(`Error getting goals: ${error}`);
    res.status(500);
  }
});

router.post("/set", async (req, res) => {
  try {
    const { userID, goalDescription, goalDate } = req.body;

    const response = await service.addGoal(userID, goalDescription, goalDate);
    if (response) {
      res.json({ message: "Goal set successfully" });
    }
  } catch (error) {
    console.error(`Error setting goal: ${error}`);
    res.status(500);
  }
});

module.exports = router;
