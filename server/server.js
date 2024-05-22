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

const app = express();

app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://personal-finance-tracker-pft-client.azurewebsites.net",
      "https://personal-finance-tracker-server.azurewebsites.net/",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

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

const authRoutes = require("./routes/auth");
const goalsRoutes = require("./routes/goals");
const userRoutes = require("./routes/user");
const transactionsRoutes = require("./routes/transactions");
const adminRoutes = require("./routes/admin");
const blobRoutes = require("./routes/blobStorage");

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blob", blobRoutes);

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
