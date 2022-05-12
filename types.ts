export interface ServerToClientEvents {
  message: (message: string, from: { id: string; nickname: string }) => void;
  sendRoomMessageHistory: (messages: MessageType[]) => void;
  connected: (user: User) => void;
  roomList: (rooms: ChatRoom[]) => void;
  joined: (room: string) => void;
  _error: (errorMessage: string) => void;
  isTypingIndicator: (nickname: string, room: string) => void;
  left: (room: string) => void;
  users: (users: User[]) => void;
  sendUserID: (userID: string) => void;
  privateMessage: (content: string, from: string) => void;
  initSession: (session: SessionInterface) => void;
  sendPrivateMessageHistory: (messages: DirectMessage[]) => void;
}

export interface ClientToServerEvents {
  message: (message: string, to: string) => void;
  getRoomMessageHistory: (room: string) => void;
  join: (room: string, privateChat?: boolean | undefined) => void;
  typing: (room: string) => void;
  leave: (room: string) => void;
  getUserID: (username: string) => void;
  privateMessage: (content: string, to: string) => void;
  getPrivateMessageHistory: (id1: string, id2: string) => void;
}

export interface SessionInterface {
  sessionID: string;
  userID: string;
  nickname: string;
}

export interface InterServerEvents {}

export interface ServerSocketData {
  nickname: string;
  sessionID: string;
  userID: string;
  isConnected: boolean;
  socketID: string;
}

export interface User {
  userID: string;
  username: string;
  isConnected: boolean;
  socketID: string;
  messages?: DirectMessage[] | undefined;
}

export interface DirectMessage {
  content: string;
  from: string;
}

export interface ChatRoom {
  name: string;
  sockets: ServerSocketData[];
}

export interface MessageType {
  message: string;
  from: string;
}
