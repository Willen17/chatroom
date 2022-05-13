import { Server, Socket } from "socket.io";
import {
  addDmToPrivateMessageStore,
  getDmHistoryFor,
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
    // show a list of the clients in the room and add the new client in
    let roomUsers: string[] = [];
    (await io.in(room).fetchSockets()).map((item) =>
      roomUsers.push(item.data.nickname)
    );
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

  // actions taken when a client leaves the room and update room list
  socket.on("leave", (room) => {
    socket.leave(room);
    console.log("user left the room");
    socket.emit("left", room);
    io.emit("roomList", getRooms(io));
  });

  /**  Room message functionality below */

  // handle message from client side and emit back to sender and the recipients in the same room
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

  // send message history of a room to client on this request
  socket.on("getRoomMessageHistory", (room) => {
    let history = getRoomMessageHistory(room);
    socket.emit("sendRoomMessageHistory", history);
  });

  /**  DM functionality below */

  // handle DM from client side and emit back to sender and the specific recipient
  socket.on("privateMessage", (content, to) => {
    addDmToPrivateMessageStore(socket.data.userID, to, content);
    let idOfUser = getSocketID(to);
    socket.to(idOfUser!).emit("privateMessage", content, socket.data.userID);
    socket.emit("privateMessage", content, socket.data.userID);
  });

  // send DM history of a room to client on this request
  socket.on("getPrivateMessageHistory", (id1, id2) => {
    let history = getDmHistoryFor(id1, id2);
    socket.emit("sendPrivateMessageHistory", history);
  });
};
