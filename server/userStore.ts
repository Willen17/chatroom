import { User } from "../types";
import { IoServer } from "./server";

let users: User[] = [];

// sets user.isConnected to false
export function setDisconnected(io: IoServer, userID: string) {
  let index = users.findIndex((user) => user.userID === userID);
  users[index].isConnected = false;
}

// get a list of all users and add new user to the list
export function getUsers(io: IoServer): User[] {
  for (let [id, socket] of io.sockets.sockets) {
    // If the user.id already exists in the array, we will set the userID to same as before
    if (users.some((user) => user.userID === socket.data.userID)) {
      let index = users.findIndex((user) => user.userID === socket.data.userID);
      users[index].userID = socket.data.userID!;
      // If isConnected is set to false, we keep it as false.
    } else if (users.some((user) => user.isConnected === false)) {
      let index = users.findIndex((user) => user.isConnected === false);
      users[index].isConnected = false;
      // If none of the above is true, it means it is a new user so we push it into the array
    } else {
      users.push({
        userID: socket.data.userID!,
        username: socket.data.nickname!,
        isConnected: true,
        socketID: socket.data.socketID!,
      });
    }
  }
  return users;
}

// get userID by name
export function getIDFromName(username: string) {
  let filter = users.find((user) => user.username === username);
  return filter!.userID;
}

// get socketID by userID
export function getSocketID(userID: string) {
  let foundUser = users.find((user) => user.userID === userID);
  return foundUser?.socketID;
}
