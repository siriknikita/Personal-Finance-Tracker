const { Transaction, Category } = require("../models");
const { budgetController, categoryController } = require("../controllers");

const getTransactionCategoriesIDByUserID = async (userID) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userID },
      attributes: ["categoryID"],
    });

    return transactions.map((transaction) => transaction.categoryID);
  } catch (error) {
    console.log(
      "Erorr in getTransactionCategoriesIDByUserID controller:" + error
    );
    throw new Error(
      "Error in getTransactionCategoriesIDByUserID: controller: " + error
    );
  }
};

const getCategoryNameByID = async (categoryID) => {
  try {
    const category = await Category.findByPk(categoryID, {
      attributes: ["name"],
    });

    return category ? category.name : null;
  } catch (error) {
    console.log("Error in getCategoryNameByID controller: " + error);
    throw new Error("Error in getCategoryNameByID controller: " + error);
  }
};

const getTransactionCategoriesByUserID = async (userID) => {
  const categoriesID = await getTransactionCategoriesIDByUserID(userID);
  const categoriesList = await Promise.all(
    categoriesID.map(getCategoryNameByID)
  );
  return categoriesList;
};

const getTransactionMoneyByUserID = async (userID) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userID },
      attributes: ["amount"],
    });

    return transactions.map((transaction) => transaction.dataValues.amount);
  } catch (error) {
    console.log("Error in getTransactionMoneyByUserID controller: " + error);
    throw new Error("Error in getTransactionMoneyByUserID controller: " + error);
  }
};

const getMoneySpentOnEachCategory = async (userID) => {
  const categories = await getTransactionCategoriesByUserID(userID);
  const moneySpent = await getTransactionMoneyByUserID(userID);
  const data = categories.reduce((acc, category, index) => {
    acc[category] = (acc[category] || 0) + moneySpent[index];
    return acc;
  }, {});

  return data;
};

const addTransaction = async (userID, amount, categoryID) => {
  try {
    const transaction = await Transaction.create({
      userID,
      categoryID,
      amount,
    });
    return transaction ? true : false;
  } catch (error) {
    console.log("Error in addTransaction controller: " + error);
    throw new Error("Error in addTransaction controller: " + error);
  }
};

const getTransactionsByID = async (userID) => {
  try {
    return await Transaction.findAll({ where: { userID } });
  } catch (error) {
    console.log("Error in getTransactionsByID controller: " + error);
    throw new Error("Error in getTransactionsByID controller: " + error);
  }
};

const getTotalSpent = async (userID) => {
  try {
    return await budgetController.getTotalSpentByUserID(userID);
  } catch (error) {
    console.log("Error in getTotalSpent controller: " + error);
    throw new Error("Error in getTotalSpent controller: " + error);
  }
};

const updateTotalMoneySpentByUserID = async (userID, amount) => {
  try {
    const budget = await budgetController.updateBudget(userID, amount);
    if (!budget) {
      return false;
    }

    return true;
  } catch (error) {
    console.log("Error in updateTotalMoneySpentByUserID controller: " + error);
    throw new Error(
      "Error in updateTotalMoneySpentByUserID controller: " + error
    );
  }
};

const getMoneySpentByCategoryID = async (categoryID) => {
  try {
    const transactions = await Transaction.findAll({
      where: { categoryID: categoryID },
      attributes: ["amount"],
    });

    return transactions.map((transaction) => transaction.dataValues.amount);
  } catch (error) {
    console.log("Error in getMoneySpentByCategoryID controller: " + error);
    throw new Error("Error in getMoneySpentByCategoryID controller: " + error);
  }
};

const getTop5FrequentCategories = async () => {
  try {
    const topCategories = await Transaction.findAll({
      attributes: [
        "categoryID",
        [Sequelize.fn("COUNT", Sequelize.col("categoryID")), "count"],
      ],
      group: ["categoryID"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("categoryID")), "DESC"]],
      limit: 5,
    });

    return topCategories.map((category) => ({
      categoryID: category.categoryID,
      count: category.get("count"),
    }));
  } catch (error) {
    console.log("Error in getTop5FrequentCategories controller: " + error);
    throw new Error("Error in getTop5FrequentCategories controller: " + error);
  }
};

const getTop5CategoriesFrequencies = async () => {
  try {
    const topCategories = await getTop5FrequentCategories();
    const top5CategoriesFrequencies = {};

    for (const category of topCategories) {
      const categoryName = await getCategoryNameByID(category.categoryID);
      top5CategoriesFrequencies[categoryName] = category.count;
    }

    return top5CategoriesFrequencies;
  } catch (error) {
    console.log("Error in getTop5CategoriesFrequencies controller: " + error);
    throw new Error(
      "Error in getTop5CategoriesFrequencies controller: " + error
    );
  }
};

const getTop5CategoriesNames = async () => {
  try {
    const topCategories = await getTop5FrequentCategories();
    const top5CategoriesNames = [];

    for (const category of topCategories) {
      const categoryName = await getCategoryNameByID(category.categoryID);
      top5CategoriesNames.push(categoryName);
    }

    return top5CategoriesNames;
  } catch (error) {
    console.log("Error in getTop5CategoriesNames controller: " + error);
    throw new Error("Error in getTop5CategoriesNames controller: " + error);
  }
};

const getTotalUsersSpending = async () => {
  try {
    const categoriesData = await categoryController.getCategoriesList();
    const categories = categoriesData.map((category) => category.dataValues);
    const totalUsersSpending = {};

    for (const category of categories) {
      const moneySpent = await getMoneySpentByCategoryID(category.id);
      totalUsersSpending[category.name] = moneySpent.reduce(
        (acc, amount) => acc + amount,
        0
      );
    }

    return totalUsersSpending;
  } catch (error) {
    console.log("Error in getTotalUsersSpending controller: " + error);
    throw new Error("Error in getTotalUsersSpending controller: " + error);
  }
};

module.exports = {
  getTransactionCategoriesIDByUserID,
  getCategoryNameByID,
  getTransactionCategoriesByUserID,
  getTransactionMoneyByUserID,
  getMoneySpentOnEachCategory,
  addTransaction,
  getTransactionsByID,
  getTotalSpent,
  updateTotalMoneySpentByUserID,
  getMoneySpentByCategoryID,
  getTop5FrequentCategories,
  getTop5CategoriesFrequencies,
  getTop5CategoriesNames,
  getTotalUsersSpending,
};
