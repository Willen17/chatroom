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
import { getIDFromName, getUsers, setDisconnected } from "./userStore";
import { getRooms } from "./roomStore";
import { findSession, saveSession } from "./sessionStore";

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  ServerSocketData
>({ path: "/socket" });

export type IoServer = typeof io;
export type IoSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    //find existing session
    const session = findSession(sessionID);
    if (session) {
      socket.data.sessionID = sessionID;
      socket.data.userID = session.userID;
      socket.data.nickname = session.nickname;
      socket.data.socketID = socket.id;
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
  socket.data.socketID = socket.id;
  next();
});

io.on("connection", (socket) => {
  console.log("a user connected");

  saveSession(socket.data.sessionID!, {
    userID: socket.data.userID,
    nickname: socket.data.nickname,
    isConnected: socket.data.isConnected,
    socketID: socket.id,
  });

  socket.emit("initSession", {
    sessionID: socket.data.sessionID!,
    userID: socket.data.userID!,
    nickname: socket.data.nickname!,
  });
  if (socket.data.nickname) {
    socket.emit("connected", {
      userID: socket.data.userID!,
      username: socket.data.nickname,
      isConnected: socket.data.isConnected!,
      socketID: socket.data.socketID!,
    });

    io.emit("users", getUsers(io));
    socket.emit("roomList", getRooms(io));

    registerChatHandler(io, socket);
  }

  socket.on("getUserID", (username) => {
    socket.emit("sendUserID", getIDFromName(username));
  });

  socket.on("disconnect", function () {
    setDisconnected(io, socket.data.userID!);
    io.emit("users", getUsers(io));

    console.log("user disconnected");
  });
});

io.listen(3001);
