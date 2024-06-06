const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { categoryController } = require("../controllers");

router.use(bodyParser.json());
router.use(express.json());

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

router.get("/get/:userID", async (req, res) => {
  try {
    const categories = await categoryController.getUniqueCategoriesList(
      req.params.userID
    );
    res.status(200).json(categories);
  } catch (error) {}
});

module.exports = router;
