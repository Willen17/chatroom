import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerSocketData,
  ServerToClientEvents,
  Users,
} from "../types";
import registerChatHandler from "./chatHandler";
import { getRooms, getUsers } from "./roomStore";

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
    socket.emit("users", getUsers(io));
    socket.emit("connected", {
      userID: socket.id,
      username: socket.data.nickname,
    });
    socket.emit("roomList", getRooms(io));

    registerChatHandler(io, socket);
  }

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

io.listen(3001);
