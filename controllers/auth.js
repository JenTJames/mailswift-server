const bcrypt = require("bcrypt");

const User = require("../models/User");
const Response = require("../utils/Response");

// Creates a User
module.exports.saveUser = async (req, res) => {
  const user = req.body;
  if (
    !user ||
    !user.firstname ||
    !user.lastname ||
    !user.email ||
    !user.password
  ) {
    res
      .status(422)
      .send(
        new Response(
          false,
          "Some or all of the required properties of User obejct was not provided with the request"
        )
      );
    return;
  }
  const hashedPassword = await bcrypt.hash(user.password, 12);
  console.log(hashedPassword);
  try {
    const savedUser = await User.create({
      ...user,
      password: hashedPassword,
    });
    res.status(201).send(new Response(true, "OK", savedUser.id));
  } catch (error) {
    error.message = "Could not save the user";
    throw new Error(error);
  }
};

// Authenticates a User
module.exports.authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Invalid credentials");
    return;
  }
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).send(new Response(true, "Invalid credentials"));
      return;
    }
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) {
      res.status(401).send(new Response(true, "Invalid credentials"));
      return;
    }
    res.status(200).send(new Response(true, "OK", "Authenticated"));
  } catch (error) {
    throw new Error(error);
  }
};

// Checks if an email is available for using
module.exports.checkEmailAvailability = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    res.status(400).send(new Response(false, "Invalid email"));
    return;
  }
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (user) {
    res.status(200).send(new Response(true, "OK", false));
    return;
  }
  res.status(200).send(new Response(true, "OK", true));
};
