const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

require("dotenv").config();

const account = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!account || !accountKey || !containerName) {
  throw new Error(
    "Azure Storage account name, account key, and container name must be set in environment variables"
  );
}

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);

async function uploadPhotoToAzureStorage(base64Data, photoName) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${photoName}.jpg`;
    const imageBuffer = Buffer.from(base64Data, "base64");
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadData(imageBuffer, {
      blobHTTPHeaders: { blobContentType: "text/plain" },
    });
    console.log(
      `Screenshot ${photoName} was successfully uploaded to Azure Blob Storage.`
    );
  } catch (error) {
    console.error("Error loading screenshot on Azure Blob Storage:", error);
    throw error;
  }
}

async function fetchImageAsBuffer(containerName, blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

  return downloaded;
}

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
          chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
          resolve(Buffer.concat(chunks));
      });
      readableStream.on("error", reject);
  });
}

module.exports = {
  uploadPhotoToAzureStorage,
  fetchImageAsBuffer,
};
