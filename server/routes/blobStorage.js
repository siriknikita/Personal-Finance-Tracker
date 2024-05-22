const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const database = require("../database");
const { uploadScreenshotToBlob } = require("../azureStorage");

router.use(bodyParser.json());
router.use(express.json());

router.post("/upload/screenshot", async (req, res) => {
  try {
    const { imageName, image } = req.body;
    await uploadScreenshotToBlob(imageName, image);
    res.status(200).send("Image uploaded successfully");
  } catch (error) {
    console.error(`Error uploading image: ${error}`);
    res.status(500);
  }
});

module.exports = router;
