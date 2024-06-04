const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { transactionController, budgetController } = require("../controllers");

router.use(bodyParser.json());
router.use(express.json());

/**
 * @swagger
 * /api/transactions/get/{userID}:
 *   get:
 *     summary: Retrieve transactions for a specific user
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of transactions
 *       500:
 *         description: Error getting transactions
 */
router.get("/get/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const transactions = await transactionController.getTransactionsByID(
      userID
    );
    res.status(200).json({ transactions: transactions });
  } catch (error) {
    console.error(`Error getting transactions: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/transactions/get/moneySpent/{userID}:
 *   get:
 *     summary: Retrieve total money spent by a specific user
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Total money spent by the user
 *       500:
 *         description: Error getting total spent
 */
router.get("/get/moneySpent/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const moneySpent = await transactionController.getTransactionMoneyByUserID(
      userID
    );
    res.status(200).json({ moneySpent: moneySpent });
  } catch (error) {
    console.error(`Error getting total spent: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/transactions/get/moneySpent/categories/{userID}:
 *   get:
 *     summary: Retrieve money spent on each category by a specific user
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Money spent on each category by the user
 *       500:
 *         description: Error getting money spent on each category
 */
router.get("/get/moneySpent/categories/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const moneySpentOnEachCategory =
      await transactionController.getMoneySpentOnEachCategory(userID);
    res.status(200).json({ data: moneySpentOnEachCategory });
  } catch (error) {
    console.error(`Error getting money spent on each category: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/transactions/get/spendings/top5:
 *   get:
 *     summary: Retrieve the top 5 spending categories based on frequency
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Top 5 spending categories
 *       500:
 *         description: Error getting top 5 spendings
 */
router.get("/get/spendings/top5", async (req, res) => {
  try {
    const top5SpendingsFreq =
      await transactionController.getTop5CategoriesFrequencies();
    res.status(200).json({
      top5Spendings: top5SpendingsFreq,
    });
  } catch (error) {
    console.error(`Error getting top 5 spendings: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/transactions/get/categories/{userID}:
 *   get:
 *     summary: Retrieve transaction categories for a specific user
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Transaction categories for the user
 *       500:
 *         description: Error getting transaction categories
 */
router.get("/get/categories/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const categories =
      await transactionController.getTransactionCategoriesByUserID(userID);
    res.status(200).json({ categories: categories });
  } catch (error) {
    console.error(`Error getting transaction categories: ${error}`);
    res.status(500);
  }
});

/**
 * @swagger
 * /api/transactions/add:
 *   post:
 *     summary: Add a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               amount:
 *                 type: number
 *               categoryID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction added successfully
 *       500:
 *         description: Error adding transaction
 */
router.post("/add", async (req, res) => {
  try {
    const { userID, amount, categoryID } = req.body;

    const response = await transactionController.addTransaction(
      userID,
      amount,
      categoryID
    );
    const updatedTotalSpent = await budgetController.updateBudget(userID, amount);
    if (response && updatedTotalSpent) {
      res.status(200).json({ message: "Transaction added successfully" });
    }
  } catch (error) {
    console.error(`Error adding transaction: ${error}`);
    res.status(500);
  }
});

module.exports = router;
