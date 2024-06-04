const moment = require("moment");
const { Budget } = require("../models");
const { sendBudgetLimitExceededEmail } = require("./sendEmail");

const createUserBudget = async (userID) => {
  try {
    const newBudget = await Budget.create({
      userID,
    });

    await newBudget.save();

    return newBudget;
  } catch (error) {
    console.log("Error in createUserBudget controller" + error);
    throw new Error("Error in createUserBudget controller: " + error);
  }
};

const getBudgetByUserID = async (userID) => {
  try {
    const budget = await Budget.findOne({
      where: { userID },
    });

    return budget;
  } catch (error) {
    console.log("Error in getBudgetByUserID controller" + error);
    throw new Error("Error in getBudgetByUserID controller: " + error);
  }
};

const getMonthlyLimitByUserID = async (userID) => {
  try {
    const budget = await getBudgetByUserID(userID);

    if (!budget) {
      throw new Error("Budget not found");
    }

    return budget.dataValues.monthlyLimit;
  } catch (error) {
    console.log("Error in getMonthlyLimitByUserID controller" + error);
    throw new Error("Error in getMonthlyLimitByUserID controller: " + error);
  }
};

const getTotalSpentByUserID = async (userID) => {
  try {
    const budget = await getBudgetByUserID(userID);

    if (!budget) {
      throw new Error("Budget not found");
    }

    return budget.dataValues.totalSpent;
  } catch (error) {
    console.log("Error in getTotalSpentByUserID controller" + error);
    throw new Error("Error in getTotalSpentByUserID controller: " + error);
  }
};

const updateBudget = async (userID, amount) => {
  try {
    const budget = await getBudgetByUserID(userID);

    if (!budget) {
      throw new Error("Budget not found");
    }

    const newTotalSpent = budget.totalSpent + amount;
    const currentWeek = moment().isoWeek();
    const lastUpdatedWeek = moment(budget.updatedAt).isoWeek();
    let newWeeklySpent = budget.weeklySpent;
    if (currentWeek !== lastUpdatedWeek) {
      newWeeklySpent = 0;
    }
    newWeeklySpent += amount;

    await Budget.update(
      {
        totalSpent: newTotalSpent,
        weeklySpent: newWeeklySpent,
      },
      {
        where: { userID },
      }
    );

    if (newTotalSpent > budget.dataValues.monthlyLimit) {
      const userController = require("./user.controller");
      const email = await userController.getEmailByUserID(userID);
      await sendBudgetLimitExceededEmail(email);
    }

    return budget;
  } catch (error) {
    console.log("Error in updateBudget controller" + error);
    throw new Error("Error in updateBudget controller: " + error);
  }
};

module.exports = {
  createUserBudget,
  getBudgetByUserID,
  getMonthlyLimitByUserID,
  getTotalSpentByUserID,
  updateBudget,
};
