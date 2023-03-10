const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();;
const cors = require("cors");
const app = express();
const { authSocket, socketServer } = require("./socketServer");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");
const all_routes = require('express-list-endpoints');


const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
	cors: {
		origin: [
			"http://localhost:3000",
			"https://sigar.vercel.app"
		],
	},
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));
mongoose.set('strictQuery', false);
mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true, useUnifiedTopology: true,
		keepAlive: true
	},
	() => {
		console.log("MongoDB connected to " + mongoose.connection.name);
	}
);

httpServer.listen(process.env.PORT || 4000, () => {
	console.log("Listening for server");
});

app.use(express.json());
app.use(cors());
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);




app.get("/", function(req, res) {
	res.status(200).json({
		message: "server is running perfectly",
		status: 200,
		routes: all_routes(app)
	})
})

/*
if (process.env.NODE_ENV == "production") {
	app.use(express.static(path.join(__dirname, "/client/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client/build", "index.html"));
	});
}*/
/*
app._router.stack.forEach(function(r){
	if (r.route && r.route.path){
		console.log({
			"routes": r.route.path
		})
	}
})*/