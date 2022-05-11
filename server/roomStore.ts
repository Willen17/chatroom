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

let users: User[] = [];

// This function sets isConnected to false
export function setDisconnected(io: Server, userID: string) {
  let index = users.findIndex((user) => user.userID === userID);
  users[index].isConnected = false;
}

export function getUsers(io: Server): User[] {
  for (let [id, socket] of io.sockets.sockets) {
    //If the user.id already exists in the array, we will set the userID to same as before
    if (users.some((user) => user.userID === socket.data.userID)) {
      let index = users.findIndex((user) => user.userID === socket.data.userID);
      users[index].userID = socket.data.userID;
      //If isConnected is set to false, we keep it as false.
    } else if (users.some((user) => user.isConnected === false)) {
      let index = users.findIndex((user) => user.isConnected === false);
      users[index].isConnected = false;
      // If non of the above is true, then it means it is a new user, and then we push it to the array
    } else {
      users.push({
        userID: socket.data.userID,
        username: socket.data.nickname,
        isConnected: true,
      });
    }
  }
  return users;
}
