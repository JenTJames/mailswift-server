const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const errorRoutes = require("./routes/error");
const sequelize = require("./utils/database");

const PORT = 3001;

const app = express();

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
  next();
});

app.use(bodyParser.json());

app.use("/auth", authRoutes);

app.use("/", errorRoutes.get404);
app.use(errorRoutes.errorHandler);

sequelize
  .sync({
    force: false, // True for drop and create tables on server reload
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((error) => {
    console.log("Database sync failed. " + error);
  });
