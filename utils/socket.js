let io;
module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket connection could not be established!");
    }
    return io;
  },
};
