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

async function uploadPhotoToAzureStorage(photoData, photoName) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${photoName}.jpg`; 
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); 
    const base64Data = photoData.replace(/^data:image\/jpeg;base64,/, ''); 
    const byteArray = Buffer.from(base64Data, "base64");
    await blockBlobClient.upload(byteArray, byteArray.length);
    console.log(`Screenshot ${photoName} was successfully uploaded to Azure Blob Storage.`);
  } catch (error) {
    console.error("Error loading screenshot on Azure Blob Storage:", error);
    throw error;
  }
}

module.exports = {
  uploadPhotoToAzureStorage,
};
