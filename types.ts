export interface ServerToClientEvents {
  message: (message: string, from: { id: string; nickname: string }) => void;
  connected: (user: Users) => void;
  roomList: (rooms: ChatRoom[]) => void;
  joined: (room: string) => void;
  _error: (errorMessage: string) => void;
  isTypingIndicator: (nickname: string, room: string) => void;
  left: (room: string) => void;
  users: (users: Users[]) => void;
  sendUserID: (userID: string) => void;
}

export interface ClientToServerEvents {
  message: (message: string, to: string) => void;
  join: (room: string) => void;
  typing: (room: string) => void;
  leave: (room: string) => void;
  getUserID: (username: string) => void;
}

export interface InterServerEvents {}

export interface ServerSocketData {
  nickname: string;
}

export interface Users {
  userID: string;
  username: string;
}

export interface ChatRoom {
  name: string;
  sockets: ServerSocketData[];
}
