require("dotenv").config();

const appInsights = require("applicationinsights");
appInsights
  .setup(process.env.AZURE_APPLICATION_INSIGHTS_CONNECTION_STRING)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true)
  .setUseDiskRetryCaching(true)
  .start();

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const cookieParser = require("cookie-parser");
const app = express();
const multer = require("multer");
const upload = multer();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  // res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});

app.use(
  cors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  try {
    res.send("Test Hello World from server!");
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

const authRoutes = require("./routes/auth.route");
const goalsRoutes = require("./routes/goals.route");
const userRoutes = require("./routes/user.route");
const transactionsRoutes = require("./routes/transactions.route");
const adminRoutes = require("./routes/admin.route");
const blobRoutes = require("./routes/blobStorage.route");
const { cookieJWTAuth } = require("./middleware/cookieJWTAuth");

app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/goals", cookieJWTAuth, goalsRoutes);
app.use("/api/user", cookieJWTAuth, userRoutes);
app.use("/api/transactions", cookieJWTAuth, transactionsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blob", cookieJWTAuth, blobRoutes);

const PORT = process.env.PORT || 8080;

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
    app.listen(PORT, () => {
      console.log(`Server starts on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
