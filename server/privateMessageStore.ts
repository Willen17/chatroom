import { DirectMessage } from "../types";

let privateMessageStore = new Map<string, DirectMessage[]>();

export const addMessageToMessageStore = (
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

export const getMessageHistoryFor = (id1: string, id2: string) => {
  const chatName = createPrivateRoomID(id1, id2);
  console.log(chatName, " from messagehistory");

  return privateMessageStore.get(chatName);
};
// {
//   'user1': []
//   'David': []
//   'My': []
// }

// const object: {[key: string]: DirectMessage[]} = {}
// const map = new Map<string, DirectMessage[]>()
// map.get('David')

export const createPrivateRoomID = (id1: string, id2: string) => {
  if (id1 > id2) {
    return `${id1}&${id2}`;
  } else return `${id2}&${id1}`;
};
