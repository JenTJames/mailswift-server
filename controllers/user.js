const { Op } = require("sequelize");
const User = require("../models/User");

module.exports.getUser = async (identifier) => {
  const user = await User.findOne({
    attributes: {
      exclude: ["password", "token"],
    },
    where: {
      [Op.or]: [{ id: identifier }, { email: identifier }],
    },
  });
  return user;
};
