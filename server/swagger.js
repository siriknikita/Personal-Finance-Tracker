const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const fs = require("fs");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Personal Finance Tracker API",
    version: "1.0.0",
    description: "API for the Personal Finance Tracker application",
  },
};

const routesPath = path.join(process.cwd(), "routes");
if (!fs.existsSync(routesPath)) {
  throw new Error(`Routes directory does not exist: ${routesPath}`);
}

const routeFiles = fs
  .readdirSync(routesPath)
  .filter((file) => file.endsWith(".route.js"));
if (routeFiles.length === 0) {
  throw new Error(
    `No .route.js files found in routes directory: ${routesPath}`
  );
}

const options = {
  swaggerDefinition,
  apis: routeFiles.map((file) => path.join(routesPath, file)),
};

try {
  const swaggerSpec = swaggerJSDoc(options);
  module.exports = swaggerSpec;
} catch (error) {
  console.error("Error generating Swagger specification:", error);
  throw error;
}
