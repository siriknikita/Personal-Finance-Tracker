const { Category } = require("../models");
const { getTransactionCategoriesByUserID } = require("./transaction.controller");

const getCategoriesList = async () => {
  try {
    return await Category.findAll();
  } catch (error) {
    console.log("Error in getCategoriesList controller: " + error);
    throw new Error("Error in getCategoriesList controller: " + error);
  }
};

const getUniqueCategoriesList = async (userID) => {
  const categories =
    await getTransactionCategoriesByUserID(userID);
  return Array.from(new Set(categories));
};

module.exports = {
  getCategoriesList,
  getUniqueCategoriesList,
};
