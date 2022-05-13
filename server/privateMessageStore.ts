import { DirectMessage } from "../types";

let privateMessageStore = new Map<string, DirectMessage[]>();

// save DMs in the private message store
export const addDmToPrivateMessageStore = (
  from: string,
  to: string,
  content: string
) => {
  const chatName = createPrivateRoomID(from, to);
  if (!privateMessageStore.has(chatName)) {
    privateMessageStore.set(chatName, []);
  }
  const chatHistory = privateMessageStore.get(chatName)!;
  chatHistory.push({ content, from });
};

// retrieve DM history of a specific chat from the private message store
export const getDmHistoryFor = (id1: string, id2: string) => {
  const chatName = createPrivateRoomID(id1, id2);
  return privateMessageStore.get(chatName);
};

// create id for a private room by 2 IDs
export const createPrivateRoomID = (id1: string, id2: string) => {
  if (id1 > id2) {
    return `${id1}&${id2}`;
  } else return `${id2}&${id1}`;
};
