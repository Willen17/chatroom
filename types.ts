export interface ServerToClientEvents {
  message: (message: string, from: { id: string; nickname: string }) => void;
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
}

export interface ClientToServerEvents {
  message: (message: string, to: string) => void;
  join: (room: string) => void;
  typing: (room: string) => void;
  leave: (room: string) => void;
  getUserID: (username: string) => void;
  privateMessage: (content: string, to: string) => void;
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
}

export interface User {
  userID: string;
  username: string;
  isConnected: boolean;
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
