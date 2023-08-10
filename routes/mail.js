const express = require("express");

const mailController = require("../controllers/mail");

const interceptor = require("../utils/interceptor");

const router = express.Router();

router.get(
  "/received/users/:userId",
  interceptor,
  mailController.getReceivedMails
);

module.exports = router;
