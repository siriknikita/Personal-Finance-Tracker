const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const service = require("../services/transactionService");

router.use(bodyParser.json());
router.use(express.json());

router.get("/get/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const transactions = await service.getTransactionsByID(userID);
    res.status(200).json({ transactions: transactions });
  } catch (error) {
    console.error(`Error getting transactions: ${error}`);
    res.status(500);
  }
});

router.get("/get/moneySpent/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const moneySpent = await service.getTransactionMoneyByUserID(userID);
    res.status(200).json({ moneySpent: moneySpent });
  } catch (error) {
    console.error(`Error getting total spent: ${error}`);
    res.status(500);
  }
});

router.get("/get/moneySpent/categories/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const moneySpentOnEachCategory = await service.getMoneySpentOnEachCategory(
      userID
    );
    res.status(200).json({ data: moneySpentOnEachCategory });
  } catch (error) {
    console.error(`Error getting money spent on each category: ${error}`);
    res.status(500);
  }
});

router.get("/get/spendings/top5", async (req, res) => {
  try {
    const top5SpendingsFreq = await service.getTop5CategoriesFrequencies();
    res.status(200).json({
      top5Spendings: top5SpendingsFreq,
    });
  } catch (error) {
    console.error(`Error getting top 5 spendings: ${error}`);
    res.status(500);
  }
});

router.get("/get/categories/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const categories = await service.getTransactionCategoriesByUserID(userID);
    res.status(200).json({ categories: categories });
  } catch (error) {
    console.error(`Error getting transaction categories: ${error}`);
    res.status(500);
  }
});

router.post("/add", async (req, res) => {
  try {
    const { userID, amount, categoryID } = req.body;

    const response = await service.addTransaction(userID, amount, categoryID);
    if (response) {
      res.status(200).json({ message: "Transaction added successfully" });
    }
  } catch (error) {
    console.error(`Error adding transaction: ${error}`);
    res.status(500);
  }
});

module.exports = router;
