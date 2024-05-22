const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

require('dotenv').config();

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!account || !accountKey || !containerName) {
  throw new Error("Azure Storage account name, account key, and container name must be set in environment variables");
}

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

async function uploadScreenshotToBlob(imageName, image) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(imageName);
  await blockBlobClient.upload(image, image.length);
}

module.exports = {
  uploadScreenshotToBlob,
};
