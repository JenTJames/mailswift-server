const Response = require("../utils/Response");

const Mail = require("../models/Mail");
const userController = require("../controllers/user");

module.exports.getReceivedMails = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const user = await userController.getUser(userId);
    console.log(user);
  } catch (error) {
    error.message = "The user with ID " + userId + " does not exist";
    throw new Error(error);
  }
  res.sendStatus(200);
};

module.exports.sendMail = async (req, res) => {
  const mail = req.body;
  if (!mail || !mail.subject || !mail.body || !mail.sender || !mail.receiver) {
    res
      .status(400)
      .send(
        new Response(
          false,
          "All or some of the required fields of mail object was not received"
        )
      );
    return;
  }
  try {
    const sender = await userController.getUser(mail.sender);
    if (!sender) {
      res
        .status(400)
        .send(
          new Response(
            false,
            "Could not find any sender with the given email: " + mail.sender
          )
        );
      return;
    }
    const receiver = await userController.getUser(mail.receiver);
    if (!receiver) {
      res
        .status(400)
        .send(
          new Response(
            false,
            "Could not find any receiver with the given email: " + mail.receiver
          )
        );
      return;
    }
    const savedMail = await Mail.create({
      subject: mail.subject,
      body: mail.body,
    });
    savedMail.setSender(sender);
    savedMail.setReceiver(receiver);
    res.status(201).send(new Response(true, "Mail send", savedMail.id));
  } catch (error) {
    error.message = "Could not send the mail";
    throw new Error(error);
  }
};
