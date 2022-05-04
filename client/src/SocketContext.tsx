import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../types";

export type ContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
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

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
      autoConnect: false,
      path: "/socket",
    });
    setSocket(newSocket);
  }, []);

  // fetch the number of clients in the room
  useEffect(() => {
    socket?.on("clientsInRoom", (noOfClients: number) => {
      setNoOfClients(noOfClients);
    });
  });
  console.log("no. of clients in room: ", noOfClients);

  // fetch the list of clients' nickname in the room
  useEffect(() => {
    socket?.on("ListOfClientsInRoom", (clients: string[]) => {
      setClients(clients);
    });
  });
  console.log(clients);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
