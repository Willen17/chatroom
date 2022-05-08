export interface ServerToClientEvents {
  message: (message: string, from: { id: string; nickname: string }) => void;
  connected: (nickname: string) => void;
  roomList: (rooms: ChatRoom[]) => void;
  joined: (room: string) => void;
  _error: (errorMessage: string) => void;
  ListOfClientsInRoom: (clients: string[]) => void;
  clientsInRoom: (noOfClients: number) => void;
  isTypingIndicator: (nickname: string, room: string) => void;
  left: (room: string) => void;
  clients: (room: string, listOfClients: string[]) => void;
}

export interface ClientToServerEvents {
  message: (message: string, to: string) => void;
  join: (room: string) => void;
  typing: (room: string) => void;
  leave: (room: string) => void;
  clients: (room: string) => void;
}

export interface InterServerEvents {}

export interface ServerSocketData {
  nickname: string;
}

export interface ChatRoom {
  name: string;
  sockets: ServerSocketData[];
}
