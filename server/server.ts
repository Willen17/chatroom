import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerSocketData,
  ServerToClientEvents,
  User,
} from "../types";
import registerChatHandler from "./chatHandler";
import { getIDFromName } from "./directMessages";
import { getRooms, getUsers } from "./roomStore";
import { findSession, saveSession } from "./sessionStore";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  ServerSocketData
>({ path: "/socket" });

io.use((socket: Socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    //find existing session
    const session = findSession(sessionID);
    if (session) {
      socket.data.sessionID = sessionID;
      socket.data.userID = session.userID;
      socket.data.nickname = session.nickname;
      return next();
    }
  }

  const nickname: string = socket.handshake.auth.nickname;
  if (!nickname || nickname.length < 3) {
    return next(new Error("Invalid nickname"));
  }

  //create new session
  socket.data.sessionID = randomUUID();
  socket.data.userID = randomUUID();
  socket.data.nickname = nickname;
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected");

  saveSession(socket.data.sessionID!, {
    userID: socket.data.userID,
    nickname: socket.data.nickname,
    connected: true,
  });

  socket.emit("initSession", {
    sessionID: socket.data.sessionID!,
    userID: socket.data.userID!,
    nickname: socket.data.nickname!,
  });
  if (socket.data.nickname) {
    socket.emit("connected", {
      userID: socket.id,
      username: socket.data.nickname,
    });

    io.emit("users", getUsers(io));
    socket.emit("roomList", getRooms(io));

    registerChatHandler(io, socket);
  }

  socket.on("getUserID", (username) => {
    socket.emit("sendUserID", getIDFromName(io, username));
  });

  socket.on("disconnect", function () {
    io.emit("users", getUsers(io));

    console.log("user disconnected");
  });
});

io.listen(3001);
