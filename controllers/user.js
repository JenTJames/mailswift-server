const User = require("../models/User");

module.exports.getUser = async (userId) => {
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  return user;
};
