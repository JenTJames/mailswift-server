const express = require("express");

const mailController = require("../controllers/mail");

const interceptor = require("../utils/interceptor");

const router = express.Router();

//TODO: Uncomment interceptor for route protection

router.get(
  "/inbox/users/:userId",
  // interceptor,
  mailController.getReceivedMails
);

router.post(
  "/",
  // interceptor,
  mailController.sendMail
);

module.exports = router;
