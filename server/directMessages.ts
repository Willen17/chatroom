import { userInfo } from "os";
import { Server } from "socket.io";
import { getUsers } from "./roomStore";

export function getIDFromName(io: Server, username: string) {
  console.log(username);
  let filter = getUsers(io).filter((user) => user.username === username);

  return filter;
}
