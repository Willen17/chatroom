import { Server, Socket } from "socket.io";
import { addMessageToMessageStore, getMessageHistoryFor } from "./messageStore";
import { getRooms } from "./roomStore";
import { getSocketID } from "./userStore";

export default (io: Server, socket: Socket) => {
  socket.on("join", async (room: string, privateChat?: boolean) => {
    // if its a private chat then we are creating a room name that's unique using both user's username
    if (privateChat) {
      let splittedRoomName = room.split("&"); // returns an awway with the name of the users: ["user1", "user2"]

      let unique = [...new Set(splittedRoomName)].sort((a, b) =>
        a < b ? -1 : 1
      ); // This code sorts the array so that both users will have the same name of the room
      // For example if user321 wants to chat with user123, then from the client user321 sends room name: user321-user123. But we wanna make sure the room name has the names in the right order for both.

      let newRoomName = `${unique[0]}&${unique[1]}`; // Will return user1&user2

      socket.join(newRoomName);
    } else {
      socket.join(room);

      if (!getRooms(io).some((e) => e.name == room)) {
        io.emit("roomList", getRooms(io));
      }
      io.emit("roomList", getRooms(io));

      // show a list of the clients in the room
      let roomUsers: string[] = [];
      (await io.in(room).fetchSockets()).map((item) =>
        roomUsers.push(item.data.nickname)
      );
      // io.emit("ListOfClientsInRoom", roomUsers);
      socket.emit("joined", room);
    }
  });

  socket.on("typing", (room) =>
    socket.broadcast.to(room).emit("isTypingIndicator", socket.data.nickname)
  );

  socket.on("message", (message, to) => {
    if (!socket.data.nickname) {
      return socket.emit("_error", "Missing nickname on socket");
    }
    io.to(to).emit("message", message, {
      id: socket.data.userID,
      nickname: socket.data.nickname,
    });
  });

  socket.on("leave", (room) => {
    socket.leave(room);
    console.log("user left the room");
    socket.emit("left", room);
    io.emit("roomList", getRooms(io));
  });

  // DM functionality below

  socket.on("privateMessage", (content, to) => {
    // socket.to(to).emit("privateMessage", content, socket.data.userID);
    // socket.emit("privateMessage", content, socket.data.userID);

    addMessageToMessageStore(socket.data.userID, to, content);

    let idOfUser = getSocketID(to);
    socket.to(idOfUser!).emit("privateMessage", content, socket.data.userID);
    socket.emit("privateMessage", content, socket.data.userID);
  });

  socket.on("getPrivateMessageHistory", (id1, id2) => {
    let history = getMessageHistoryFor(id1, id2);
    console.log(history);

    socket.emit("sendPrivateMessageHistory", history);
  });
};
