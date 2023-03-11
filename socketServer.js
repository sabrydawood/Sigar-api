const jwt = require("jsonwebtoken");
let users = [];

const authSocket = (socket, next) => {
  let token = socket.handshake.auth.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      socket.decoded = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  } else {
    next(new Error("Authentication error"));
  }
};

const socketServer = (socket) => {
  const userId = socket.decoded.userId;
  users.push({ userId, socketId: socket.id });

  socket.on("send-message", (recipientUserId, username, content) => {
    const recipient = users.find((user) => user.userId == recipientUserId);
    if (recipient) {
      socket
        .to(recipient.socketId)
        .emit("receive-message", userId, username, content);
			
		/*	socket.emit("online", userId);
  console.log(userId, "Is Online!", socket.id);*/

    }
  });
/*
  socket.on("disconnect", () => {
    users = users.filter((user) => user.userId != userId);

		
  });
	
	socket.emit("offline", userId);
	console.log(userId, "Is Offline!", socket.id);*/

};

module.exports = { socketServer, authSocket };
