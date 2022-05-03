import { Server, Socket } from "socket.io";
import { getRooms } from "./roomStore";

export default (io: Server, socket: Socket) => {
  socket.on("join", (room) => {
    const shouldBroadcastRooms: boolean = !getRooms(io).includes(room); //Om det ya rummet inte finns med i listan getRooms, då blir det true och skapar ett nytt rum
    socket.join(room);
    if (shouldBroadcastRooms) {
      io.emit("roomList", getRooms(io));
    }
    socket.emit("joined", room);
  });

  // "typing" added for the isTyping Indicator 3/5
  socket.on("typing", () =>
    socket.broadcast.emit("isTypingIndicator", socket.data.nickname)
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
};
