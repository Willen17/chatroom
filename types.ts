export interface ServerToClientEvents {
  message: (message: string, from: { id: string; nickname: string }) => void;
  connected: (nickname: string) => void;
  roomList: (rooms: string[]) => void;
  joined: (room: string) => void;
  _error: (errorMessage: string) => void;
  ListOfClientsInRoom: (clients: string[]) => void;
  clientsInRoom: (noOfClients: number) => void;
  isTypingIndicator: (nickname: string) => void;
  left: (room: string) => void;
}

export interface ClientToServerEvents {
  message: (message: string, to: string) => void;
  join: (room: string) => void;
  typing: () => void;
  leave: (room: string) => void;
}

export interface InterServerEvents {}

export interface ServerSocketData {
  nickname: string;
}
