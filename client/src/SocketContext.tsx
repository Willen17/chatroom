import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../types";

export type ContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  rooms: String[];
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  currentRoom: string;
  clients: String[];
  noOfClients: Number;
  isTypingBlock: string;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  leaveRoom: () => void;
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
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [rooms, setRooms] = useState<String[]>([]);
  const [isTypingBlock, setIsTypingBlock] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

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

    // fetch the typing status of user
    socket?.on("isTypingIndicator", (nickname: string) => {
      if (nickname) {
        setIsTypingBlock(`${nickname} is typing...`);
        setTimeout(() => setIsTypingBlock(""), 2000);
      }
    });

    socket?.on("left", (room) => {
      console.log("Left room: ", room);
      navigate("/room");
    });
  }, [socket]);

  // leave a chatroom and be redirected to roomInput
  const leaveRoom = () => {
    socket!.emit("leave", currentRoom);
  };

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
        isTypingBlock,
        loggedIn,
        setLoggedIn,
        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
