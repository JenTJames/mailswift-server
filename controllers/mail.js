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
