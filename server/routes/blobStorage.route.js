const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { uploadPhotoToAzureStorage } = require("../azureStorage");
const moment = require("moment");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photoData:
 *                 type: string
 *                 format: binary
 *               imageName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       500:
 *         description: Error uploading image
 */
router.post(
  "/upload/screenshot",
  upload.single("photoData"),
  async (req, res) => {
    try {
      const { base64File, filename } = req.body; 
      await uploadPhotoToAzureStorage(base64File, filename);
      res.status(200).json({ message: "Image uploaded successfully" });
    } catch (error) {
      console.error(`Error uploading image: ${error}`);
      res.status(500).send(`Error uploading image: ${error.message}`);
    }
  }
);

module.exports = router;
