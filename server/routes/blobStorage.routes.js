const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { uploadScreenshotToBlob } = require("../azureStorage");

router.use(bodyParser.json());
router.use(express.json());

/**
 * @swagger
 * /api/blob/upload/screenshot:
 *   post:
 *     summary: Upload a screenshot to blob storage
 *     tags: [BlobStorage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageName:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       500:
 *         description: Error uploading image
 */
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
