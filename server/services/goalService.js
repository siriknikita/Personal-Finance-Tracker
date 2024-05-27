const moment = require("moment");
const { Goal } = require("../models");

async function addGoal(userID, description, deadline) {
  try {
    deadline = moment(deadline).format("yyyy-MM-DD");

    const newGoal = await Goal.create({
      userID,
      description,
      deadline,
    });

    return newGoal;
  } catch (error) {
    console.error("[ADD GOAL] Error: " + error);
  }
}

async function getGoals(userID) {
  try {
    const goals = await Goal.findAll({ where: { userID: userID } });
    return goals;
  } catch (error) {
    console.error("[GET GOALS] Error: " + error);
  }
}

module.exports = {
  addGoal,
  getGoals,
};
