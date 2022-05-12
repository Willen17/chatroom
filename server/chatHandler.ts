import { Server, Socket } from "socket.io";
import {
  addMessageToMessageStore,
  getMessageHistoryFor,
} from "./privateMessageStore";
import {
  addMessageToRoomMessageStore,
  getRoomMessageHistory,
} from "./roomMessageStore";
import { getRooms } from "./roomStore";
import { getSocketID } from "./userStore";

export default (io: Server, socket: Socket) => {
  socket.on("join", async (room: string) => {
    socket.join(room);
    io.emit("roomList", getRooms(io));

    // show a list of the clients in the room
    let roomUsers: string[] = [];
    (await io.in(room).fetchSockets()).map((item) =>
      roomUsers.push(item.data.nickname)
    );
    // io.emit("ListOfClientsInRoom", roomUsers);
    socket.emit("joined", room);
  });

  socket.on("typing", (room, isPrivateChat) => {
    if (isPrivateChat) {
      let socketIDOfUser = getSocketID(room);
      socket.broadcast
        .to(socketIDOfUser!)
        .emit("isTypingIndicator", socket.data.nickname, true);
    } else
      socket.broadcast
        .to(room)
        .emit("isTypingIndicator", socket.data.nickname, false);
  });

  socket.on("leave", (room) => {
    socket.leave(room);
    console.log("user left the room");
    socket.emit("left", room);
    io.emit("roomList", getRooms(io));
  });

  // Room message functionality below

  socket.on("message", (message, to) => {
    if (!socket.data.nickname) {
      return socket.emit("_error", "Missing nickname on socket");
    }
    addMessageToRoomMessageStore(to, message, socket.data.userID);

    io.to(to).emit("message", message, {
      id: socket.data.userID,
      nickname: socket.data.nickname,
    });
  });

  socket.on("getRoomMessageHistory", (room) => {
    let history = getRoomMessageHistory(room);
    socket.emit("sendRoomMessageHistory", history);
  });

  // DM functionality below

  socket.on("privateMessage", (content, to) => {
    addMessageToMessageStore(socket.data.userID, to, content);
    let idOfUser = getSocketID(to);
    socket.to(idOfUser!).emit("privateMessage", content, socket.data.userID);
    socket.emit("privateMessage", content, socket.data.userID);
  });

  socket.on("getPrivateMessageHistory", (id1, id2) => {
    let history = getMessageHistoryFor(id1, id2);
    socket.emit("sendPrivateMessageHistory", history);
  });
};
