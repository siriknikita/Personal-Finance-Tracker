const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { categoryController } = require("../controllers");

router.use(bodyParser.json());
router.use(express.json());

/**
 * @swagger
 * /api/categories/get:
 *   get:
 *     summary: Retrieve list of all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Category ID
 *                       name:
 *                         type: string
 *                         description: Category name
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                 message:
 *                   type: string
 *                   description: Detailed error message
 */
router.get("/get", async (req, res) => {
  try {
    const categoriesData = await categoryController.getCategoriesList();
    let categories = [];
    for (let i = 0; i < categoriesData.length; i++) {
      categories.push(categoriesData[i].dataValues);
    }
    res.status(200).json({ categories: categories });
  } catch (error) {
    console.log("Error in getCategoriesList route: " + error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /api/categories/get/{userID}:
 *   get:
 *     summary: Retrieve unique categories list for a specific user
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Unique categories list for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Category ID
 *                   name:
 *                     type: string
 *                     description: Category name
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                 message:
 *                   type: string
 *                   description: Detailed error message
 */
router.get("/get/:userID", async (req, res) => {
  try {
    const categories = await categoryController.getUniqueCategoriesList(
      req.params.userID
    );
    res.status(200).json(categories);
  } catch (error) {
    console.log("Error in getUniqueCategoriesList route: " + error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

module.exports = router;
