const { Transaction, Category, User } = require("../models");

async function getTransactionCategoriesIDByUserID(userID) {
  try {
    const transactions = await Transaction.findAll({
      where: { userID },
      attributes: ["categoryID"],
    });

    return transactions.map((transaction) => transaction.categoryID);
  } catch (error) {
    console.error("[GET TRANSACTION CATEGORIES ID BY USER ID] Error: " + error);
  }
}

async function getCategoryNameByID(categoryID) {
  try {
    const category = await Category.findByPk(categoryID, {
      attributes: ["name"],
    });

    return category ? category.name : null;
  } catch (error) {
    console.error("[GET CATEGORY NAME BY ID] Error: " + error);
  }
}

async function getTransactionCategoriesByUserID(userID) {
  const categoriesID = await getTransactionCategoriesIDByUserID(userID);
  const categoriesList = await Promise.all(
    categoriesID.map(getCategoryNameByID)
  );
  return categoriesList;
}

async function getCategoriesList() {
  try {
    return await Category.findAll();
  } catch (error) {
    console.error("[GET CATEGORIES LIST] Error: " + error);
  }
}

async function getUniqueCategoriesList(userID) {
  const categories = await getTransactionCategoriesByUserID(userID);
  return Array.from(new Set(categories));
}

async function getTransactionMoneyByUserID(userID) {
  try {
    const transactions = await Transaction.findAll({
      where: { userID: userID },
      attributes: ["amount"],
    });

    return transactions.map((transaction) => transaction.dataValues.amount);
  } catch (error) {
    console.error("[GET TRANSACTION MONEY BY USER ID] Error: " + error);
  }
}

async function getMoneySpentOnEachCategory(userID) {
  const categories = await getTransactionCategoriesByUserID(userID);
  const moneySpent = await getTransactionMoneyByUserID(userID);
  const data = categories.reduce((acc, category, index) => {
    acc[category] = (acc[category] || 0) + moneySpent[index];
    return acc;
  }, {});

  return data;
}

async function addTransaction(userID, amount, categoryID) {
  try {
    const transaction = await Transaction.create({
      userID,
      categoryID,
      amount,
    });
    return transaction ? true : false;
  } catch (error) {
    console.error("[ADD TRANSACTION] Error: " + error);
  }
}

async function getTransactionsByID(userID) {
  try {
    return await Transaction.findAll({ where: { userID } });
  } catch (error) {
    console.error("[GET TRANSACTIONS BY ID] Error: " + error);
  }
}

async function getTotalSpent(userID) {
  try {
    const user = await User.findByPk(userID, {
      attributes: ["totalSpent"],
    });

    return user ? user.totalSpent : 0;
  } catch (error) {
    console.error("[GET TOTAL SPENT] Error: " + error);
  }
}

async function updateTotalMoneySpentByUserID(userID, amount) {
  try {
    const user = await User.findByPk(userID);
    if (!user) {
      return false;
    }

    user.totalSpent += parseFloat(amount);
    await user.save();

    return true;
  } catch (error) {
    console.error("[UPDATE TOTAL SPENT BY USER ID] Error: " + error);
  }
}

async function getMoneySpentByCategoryID(categoryID) {
  try {
    const transactions = await Transaction.findAll({
      where: { categoryID: categoryID },
      attributes: ["amount"],
    });

    return transactions.map((transaction) => transaction.dataValues.amount);
  } catch (error) {
    console.error("[GET MONEY SPENT BY CATEGORY ID] Error: " + error);
  }
}

async function getTop5FrequentCategories() {
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
    console.error("[GET TOP 5 FREQUENT SPENDINGS CATEGORIES] Error: " + error);
  }
}

async function getTop5CategoriesFrequencies() {
  try {
    const topCategories = await getTop5FrequentCategories();
    const top5CategoriesFrequencies = {};

    for (const category of topCategories) {
      const categoryName = await getCategoryNameByID(category.categoryID);
      top5CategoriesFrequencies[categoryName] = category.count;
    }

    return top5CategoriesFrequencies;
  } catch (error) {
    console.error("[GET TOP 5 CATEGORIES FREQUENCIES] Error: " + error);
  }
}

async function getTop5CategoriesNames() {
  try {
    const topCategories = await getTop5FrequentCategories();
    const top5CategoriesNames = [];

    for (const category of topCategories) {
      const categoryName = await getCategoryNameByID(category.categoryID);
      top5CategoriesNames.push(categoryName);
    }

    return top5CategoriesNames;
  } catch (error) {
    console.error("[GET TOP 5 CATEGORIES NAMES] Error: " + error);
  }
}

async function getTotalUsersSpending() {
  try {
    const categoriesData = await getCategoriesList();
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
    console.error("[GET TOTAL USERS SPENDING] Error: " + error);
  }
}

module.exports = {
  getCategoryNameByID,
  getTransactionCategoriesByUserID,
  getTransactionMoneyByUserID,
  getMoneySpentOnEachCategory,
  addTransaction,
  getTransactionsByID,
  getTotalSpent,
  getUniqueCategoriesList,
  getTop5FrequentCategories,
  getTop5CategoriesNames,
  getTop5CategoriesFrequencies,
  updateTotalMoneySpentByUserID,
  getTotalUsersSpending,
};
