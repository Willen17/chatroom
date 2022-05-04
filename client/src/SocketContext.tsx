import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../types";

export type ContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  rooms: String[];
  setCurrentRoom: React.Dispatch<React.SetStateAction<String>>;
  currentRoom: String;
  clients: String[];
  noOfClients: Number;
};

export const SocketContext = createContext<ContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

const SocketProvider: React.FC<Props> = ({ children }) => {
  const [socket, setSocket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [noOfClients, setNoOfClients] = useState<number>(0);
  const [clients, setClients] = useState<string[]>([]);
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
    // to list all rooms, put in a use effect
    socket?.on("roomList", (rooms) => {
      console.log(rooms);
      setRooms(rooms);
    });

    // fetch the number of clients in the room
    socket?.on("clientsInRoom", (noOfClients: number) => {
      setNoOfClients(noOfClients);
    });

    // fetch the list of clients' nickname in the room
    socket?.on("ListOfClientsInRoom", (clients: string[]) => {
      setClients(clients);
    });
  }, [socket]);

  console.log("no. of clients in room: ", noOfClients);
  console.log(clients);

  return (
    <SocketContext.Provider
      value={{
        socket,
        rooms,
        setCurrentRoom,
        currentRoom,
        noOfClients,
        clients,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
