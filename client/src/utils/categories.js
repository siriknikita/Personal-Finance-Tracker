const { fetchData } = require("../services/dataProcessing");

function formatMoneySpentData(data) {
  const categories = Object.keys(data);
  const values = Object.values(data);
  const formattedData = categories.map((category, index) => ({
    name: category,
    value: values[index],
  }));
  return formattedData;
}

async function getMoneySpent(userID) {
  return await fetchData(
    `transactions/get/moneySpent/categories/${userID}`,
    "data"
  );
}

async function getUsersSpending() {
  return await fetchData("admin/get/usersSpending", "usersSpending");
}

module.exports = {
  formatMoneySpentData,
  getMoneySpent,
  getUsersSpending,
};
