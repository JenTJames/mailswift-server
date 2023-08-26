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

router.get(
  "/sent-mails/users/:userId",
  // interceptor,
  mailController.getSentMails
);

router.post(
  "/",
  // interceptor,
  mailController.sendMail
);

router.put(
  "/:mailId",
  // interceptor,
  mailController.flagMail
);

router.get(
  "/:mailId",
  // interceptor,
  mailController.getMail
);

module.exports = router;
