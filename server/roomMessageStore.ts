import { MessageType } from "../types";

let roomMessageStore = new Map<string, MessageType[]>();

// save messages in the room message store
export const addMessageToRoomMessageStore = (
  roomName: string,
  message: string,
  from: string
) => {
  if (!roomMessageStore.has(roomName)) {
    roomMessageStore.set(roomName, []);
  }
  const chatHistory = roomMessageStore.get(roomName)!;
  chatHistory.push({ message, from });
};

// retrieve message history of a specific room from the room message store
export const getRoomMessageHistory = (roomName: string) => {
  return roomMessageStore.get(roomName);
};
