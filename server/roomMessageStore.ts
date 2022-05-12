import { MessageType } from "../types";

let roomMessageStore = new Map<string, MessageType[]>();

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

export const getRoomMessageHistory = (roomName: string) => {
  return roomMessageStore.get(roomName);
};
