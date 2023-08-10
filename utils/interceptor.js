const jwt = require("jsonwebtoken");

const Response = require("./Response");

const intercept = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).send(new Response(false, "Invalid token received!"));
    return;
  }
  const token = authorizationHeader.split(" ")[1];
  const isValidRequest = jwt.verify(token, "5b9c0f3a9d7e4f2b1e8a7c6d3f0e1b8a");
  if (!isValidRequest) {
    res.status(401).send(new Response(false, "Invalid token received!"));
    return;
  }
  next();
};

module.exports = intercept;
