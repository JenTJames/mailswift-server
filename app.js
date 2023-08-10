const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/User");
const Mail = require("./models/Mail");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mailRoutes = require("./routes/mail");
const errorRoutes = require("./routes/error");

const sequelize = require("./utils/database");

const PORT = 3001;

const app = express();

// Middleware to handle CORS
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow specific headers
  next();
});

app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/mails", mailRoutes);
app.use("/users", userRoutes);

app.use("/", errorRoutes.get404);
app.use(errorRoutes.errorHandler);

User.hasMany(Mail, {
  as: "receivedMails",
});
Mail.belongsTo(User, {
  as: "receiver",
});

User.hasMany(Mail, {
  as: "sentMails",
});
Mail.belongsTo(User, {
  as: "sender",
});

sequelize
  .sync({
    force: false, // True for drop and create tables on server reload
    alter: false, // True if schema can be altered
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch((error) => {
    console.log("Database sync failed. " + error);
  });
