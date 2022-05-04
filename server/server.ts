import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  ServerSocketData,
} from "../types";
import { getRooms } from "./roomStore";
import registerChatHandler from "./chatHandler";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  ServerSocketData
>({ path: "/socket" });

io.use((socket: Socket, next) => {
  const nickname: string = socket.handshake.auth.nickname;
  if (!nickname || nickname.length < 3) {
    return next(new Error("Invalid nickname"));
  }
  socket.data.nickname = nickname;
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected");

  if (socket.data.nickname) {
    socket.emit("connected", socket.data.nickname);
    socket.emit("roomList", getRooms(io));

    registerChatHandler(io, socket);
  }

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

io.listen(3001);

// socket.emit("welcome", "Welcome to our chat app!");

// socket.on("chat message", (message) => {
//   io.emit("chat message", message);
// });

// socket.on("disconnect", () => {
//   console.log("user disconnected");
// });
