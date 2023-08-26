const Response = require("../utils/Response");

const Mail = require("../models/Mail");
const userController = require("../controllers/user");

// Fetches all mails received by a user
module.exports.getReceivedMails = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await userController.getUser(userId);
    const mails = await Mail.findAll({
      include: "sender",
      where: {
        receiverId: user.id,
        isSpam: false,
        isTrash: false,
      },
    });
    let transformedMails = mails.map((mail) => getMailDTO(mail));
    res.status(200).send(new Response(true, "OK", transformedMails));
  } catch (error) {
    const err = new Error(error);
    error.message = "The user with ID " + userId + " does not exist";
    next(err);
  }
};

// Fetches all mails sent by a user
module.exports.getSentMails = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await userController.getUser(userId);
    const mails = await Mail.findAll({
      include: "receiver",
      where: {
        senderId: user.id,
      },
    });
    let transformedMails = mails.map((mail) => getMailDTO(mail.dataValues));
    res.status(200).send(new Response(true, "OK", transformedMails));
  } catch (error) {
    const err = new Error(error);
    err.message = "The user with ID " + userId + " does not exist";
    next(err);
  }
};

// sends a mail to a user
module.exports.sendMail = async (req, res, next) => {
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
    const err = new Error(error);
    error.message = "Could not send the mail";
    next(err);
  }
};

// Fetches a mail by ID
module.exports.getMail = async (req, res) => {
  const { mailId } = req.params;
  const mail = await Mail.findByPk(mailId, {
    include: "sender",
  });
  if (!mail)
    res
      .status(404)
      .send(new Response(false, "Could not locate the target mail"));
  const mailDTO = getMailDTO(mail.dataValues);
  res.status(200).send(new Response(true, "OK", mailDTO));

  // Mark the mail as read
  Mail.update(
    {
      isRead: true,
    },
    {
      where: {
        id: mailId,
      },
    }
  );
};

// Flags a mail as either spam or moves it to trash
module.exports.flagMail = async (req, res) => {
  const { mailId } = req.params;
  const { flag } = req.query;
  const { flagValue } = req.query;
  if (!flag || !flagValue) {
    res.status(400).send(new Response(false, "Invalid flag or value received"));
    return;
  }
  if (flag.toLowerCase() === "spam") {
    await Mail.update(
      { isSpam: flagValue },
      {
        where: {
          id: mailId,
        },
      }
    );
  } else {
    await Mail.update(
      { isTrash: flagValue },
      {
        where: {
          id: mailId,
        },
      }
    );
  }
  res.status(200).send(new Response(true, "OK"));
};

// Creates a mailDTO out of Mail object
const getMailDTO = (mail) => {
  return {
    id: mail.id,
    subject: mail.subject,
    body: mail.body,
    isRead: mail.isRead,
    sentAt: mail.createdAt,
    sender: {
      id: mail.sender?.id,
      name: mail.sender?.firstname + " " + mail.sender?.lastname,
      email: mail.sender?.email,
    },
    receiver: {
      id: mail.receiver?.id,
      name: mail.receiver?.firstname + " " + mail.receiver?.lastname,
      email: mail.receiver?.email,
    },
  };
};
