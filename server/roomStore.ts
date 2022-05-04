import { Server } from "socket.io";

export function getRooms(io: Server) {
  const rooms: string[] = [];
  for (let [id, socket] of io.sockets.adapter.rooms) {
    if (!socket.has(id)) {
      rooms.push(id);
    }
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
