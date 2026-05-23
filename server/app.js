require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const { connectDB } = require("./config/db");

const userRouter = require("./routes/userRoute");
const doctorRouter = require("./routes/doctorRoute");
const appointmentRouter = require("./routes/appointmentRoute");
const reportRouter = require("./routes/reportRoute");
const questionRouter = require("./routes/questionRoute");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

// ROUTES
app.use("/user", userRouter);
app.use("/doctor", doctorRouter);
app.use("/appoint", appointmentRouter);
app.use("/api/reports", reportRouter);
app.use("/api/questions", questionRouter);
app.use("/message", messageRoutes);

app.use("/upload", express.static(path.join(__dirname, "upload")));

/* SOCKET SERVER  */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ONLINE USERS MAP
const users = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /*  JOIN  */
  socket.on("join", (userId) => {
    users.set(userId, socket.id);
    console.log("User joined:", userId);
  });

  /*  MESSAGE */
  socket.on("sendMessage", (data) => {

  const msg = {
    sender: data.sender,
    receiver: data.receiver,
    message: data.message,
    time: new Date().toLocaleTimeString(),
    seen: false,
  };

  const receiverSocket = users.get(data.receiver);

  console.log("MSG:", msg);

  //  ONLY RECEIVER
  if (receiverSocket) {
    io.to(receiverSocket).emit("receiveMessage", msg);
  }
});
  /*  SEEN  */
  socket.on("messageSeen", (data) => {
    const senderSocket = users.get(data.sender);

    if (senderSocket) {
      io.to(senderSocket).emit("seenUpdate", {
        sender: data.sender,
        receiver: data.receiver,
      });
    }
  });

  /* CALL SYSTEM */
socket.on("callUser", (data) => {

  const receiverSocket = users.get(
    data.userToCall
  );

  if (receiverSocket) {

    io.to(receiverSocket).emit(
      "incomingCall",
      {
        signal: data.signalData,
        from: data.from,
      }
    );
  }
});
  
  

  socket.on("acceptCall", (data) => {
    const callerSocket = users.get(data.to);

    if (callerSocket) {
      io.to(callerSocket).emit("callAccepted", data.signal);
    }
  });

  socket.on("endCall", (data) => {
    const targetSocket = users.get(data.to);

    if (targetSocket) {
      io.to(targetSocket).emit("callEnded");
    }
  });

  /*  DISCONNECT  */
  socket.on("disconnect", () => {
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log("User disconnected:", userId);
        break;
      }
    }
  });
});

/*  SERVER START*/

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});







