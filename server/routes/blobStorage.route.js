const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { uploadPhotoToAzureStorage } = require("../azureStorage");
const moment = require("moment");
const multer = require("multer");
const upload = multer();

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
router.post("/upload/screenshot", upload.single("photoData"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('There are no files to upload.');
    }

    const photoData = req.file.buffer.toString('base64');
    const photoName = `screenshot_${moment().format("YYYY-MM-DD_HH-mm-ss")}`; 
    await uploadPhotoToAzureStorage(photoData, photoName); 
    res.status(200).send("Image uploaded successfully");
  } catch (error) {
    console.error(`Error uploading image: ${error}`);
    res.status(500);
  }
});

module.exports = router;
