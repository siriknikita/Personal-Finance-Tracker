const moment = require("moment");
const { Goal } = require("../models");

const addGoal = async (userID, description, deadline) => {
  try {
    deadline = moment(deadline).format("yyyy-MM-DD");

    const newGoal = await Goal.create({
      userID,
      description,
      deadline,
    });

    return newGoal;
  } catch (error) {
    console.log("Error in addGoal controller" + error);
    throw new Error("Error in addGoal controller: " + error);
  }
};

const getGoals = async (userID) => {
  try {
    const goals = await Goal.findAll({ where: { userID: userID } });
    return goals;
  } catch (error) {
    console.log("Error in getGoals controller" + error);
    throw new Error("Error in getGoals controller: " + error);
  }
};

module.exports = {
  addGoal,
  getGoals,
};
