const Response = require("../utils/Response");

module.exports.get404 = (_, res) => {
  res
    .status(400)
    .send(
      new Response(false, "Could not match the endpoint with any valid routes")
    );
};

module.exports.errorHandler = (error, _, res, __) => {
  console.log(error);
  res
    .status(error.code || 500)
    .send(
      new Response(
        false,
        error.message ? error.message : "Internal Server Error"
      )
    );
};
