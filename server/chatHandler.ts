import { Server, Socket } from "socket.io";
import { getRooms } from "./roomStore";

export default (io: Server, socket: Socket) => {
  socket.on("join", async (room: string) => {
    // const shouldBroadcastRooms: boolean = !getRooms(io).includes(room); //Om det ya rummet inte finns med i listan getRooms, då blir det true och skapar ett nytt rum

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
  });

  socket.on("typing", (room) =>
    socket.broadcast.to(room).emit("isTypingIndicator", socket.data.nickname)
  );

  socket.on("message", (message, to) => {
    if (!socket.data.nickname) {
      return socket.emit("_error", "Missing nickname on socket");
    }
    io.to(to).emit("message", message, {
      id: socket.id,
      nickname: socket.data.nickname,
    });
  });

  socket.on("leave", (room) => {
    socket.leave(room);
    // io.emit("roomList", getRooms(io));
    console.log("user left the room");
    socket.emit("left", room);
    io.emit("roomList", getRooms(io));
  });

  // DM functionality below

  socket.on("privateMessage", (content, to) => {
    socket.to(to).emit("privateMessage", {
      content: content,
      from: socket.id,
    });
  });
};
