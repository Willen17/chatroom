import { Server } from "socket.io";
import { User } from "../types";
import { IoServer } from "./server";

let users: User[] = [];

// This function sets isConnected to false
export function setDisconnected(io: IoServer, userID: string) {
  let index = users.findIndex((user) => user.userID === userID);
  users[index].isConnected = false;
}

export function getUsers(io: IoServer): User[] {
  for (let [id, socket] of io.sockets.sockets) {
    //If the user.id already exists in the array, we will set the userID to same as before
    if (users.some((user) => user.userID === socket.data.userID)) {
      let index = users.findIndex((user) => user.userID === socket.data.userID);
      users[index].userID = socket.data.userID!;
      //If isConnected is set to false, we keep it as false.
    } else if (users.some((user) => user.isConnected === false)) {
      let index = users.findIndex((user) => user.isConnected === false);
      users[index].isConnected = false;
      // If non of the above is true, then it means it is a new user, and then we push it to the array
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

export function getIDFromName(username: string) {
  console.log(username);
  let filter = users.find((user) => user.username === username);
  console.log(filter);

  return filter!.userID;
}

export function getSocketID(userID: string) {
  let foundUser = users.find((user) => user.userID === userID);

  return foundUser?.socketID;
}