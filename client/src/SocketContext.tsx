import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../types";

export type ContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  rooms: String[];
  setCurrentRoom: React.Dispatch<React.SetStateAction<String>>;
  currentRoom: String;
};

export const SocketContext = createContext<ContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

const SocketProvider: React.FC<Props> = ({ children }) => {
  const [socket, setSocket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [currentRoom, setCurrentRoom] = useState<String>("");
  const [rooms, setRooms] = useState<String[]>([]);

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
      autoConnect: false,
      path: "/socket",
    });

    setSocket(newSocket);
  }, []);

  useEffect(() => {
    //To list all rooms, put in a use effect
    socket?.on("roomList", (rooms) => {
      console.log(rooms);
      setRooms(rooms);
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, rooms, setCurrentRoom, currentRoom }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
