import { Server } from "socket.io";
import { ChatRoom, ServerSocketData, User } from "../types";

export function getRooms(io: Server): ChatRoom[] {
  const rooms: ChatRoom[] = [];
  for (const [id, socketIds] of io.sockets.adapter.rooms) {
    if (socketIds.has(id)) continue; // Skip self
    const sockets = Array.from(socketIds).map((id) =>
      io.sockets.sockets.get(id)
    );
    rooms.push({
      name: id,
      sockets: sockets
        .filter((s) => s?.data)
        .map((s) => s?.data) as ServerSocketData[],
    });
  }
  return rooms;
}
