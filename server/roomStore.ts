import { Server } from "socket.io";
import { ChatRoom, ServerSocketData } from "../types";

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

// doesnt work for now......
/*
export const getListOfClients = (io: Server) => {
  // show a list of the clients in the room (in console log for now)
  let roomUsers: string[] = [];
  getRooms(io).map(async (room) =>
    (await io.in(room).fetchSockets()).map((sockets) => {
      roomUsers.push(sockets.data.nickname);
      console.log(sockets.data.nickname);
    })
  );
  console.log(roomUsers);
  return roomUsers;
};
*/
