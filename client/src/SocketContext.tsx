import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../types";

interface ContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  rooms: string[];
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  currentRoom: string;
  clients: String[];
  noOfClients: number;
  isTypingBlock: string;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  leaveRoom: () => void;
  messageList: MessageType[];
  clientList: ClientListType[];
}

interface MessageType {
  message: string;
  from: string;
}

export interface ClientListType {
  room: string;
  clients: string[];
}

type Props = {
  children: React.ReactNode;
};

export const SocketContext = createContext<ContextType>({
  socket: undefined,
  rooms: [],
  setCurrentRoom: () => {},
  currentRoom: "",
  clients: [],
  noOfClients: 0,
  isTypingBlock: "",
  loggedIn: false,
  setLoggedIn: () => {},
  leaveRoom: () => {},
  messageList: [],
  clientList: [],
});

const SocketProvider: React.FC<Props> = ({ children }) => {
  const [socket, setSocket] =
    useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [noOfClients, setNoOfClients] = useState<number>(0);
  const [clients, setClients] = useState<string[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [isTypingBlock, setIsTypingBlock] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<MessageType[]>([]);
  const [clientList, setClientList] = useState<ClientListType[]>([]);
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
    socket?.on("roomList", (listofRooms) => {
      console.log(listofRooms);

      setRooms(listofRooms);
    });

    // receive the new message and update in the state
    socket?.on("message", (message, from) => {
      let messageObject: MessageType = {
        message: message,
        from: from.nickname,
      };
      setMessageList((messagesList) => [...messagesList, messageObject]);
    });

    socket?.on("clients", (room: string, listOfClients: string[]) => {
      let clientObject: ClientListType = {
        room: room,
        clients: listOfClients,
      };

      // filter out empty room
      const removeDup = (list: ClientListType[]) => {
        const clientListToAdd = [...list, clientObject];
        const filter: ClientListType[] = clientListToAdd.filter(
          (item) => item.clients.length > 0
        );
        setClientList(filter);
      };

      // if the room name matches
      if (clientList.some((item) => item.room === clientObject.room)) {
        // filter out room with duplicated name
        const filter: ClientListType[] = clientList.filter(
          (item) => item.room !== clientObject.room
        );
        removeDup(filter);
      } else {
        removeDup(clientList);
      }
    });

    // fetch the number of clients in the room
    socket?.on("clientsInRoom", (noOfClients: number) => {
      console.log("currentRoom: ", currentRoom, "no of clients: ", noOfClients);
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

    // set leave room of user
    socket?.on("left", (room) => {
      console.log("Left room: ", room);
      navigate("/room");
    });
  }, [socket, clientList]);

  // leave a chatroom and be redirected to roomInput
  const leaveRoom = () => {
    socket!.emit("leave", currentRoom);
  };

  // console.log("no. of clients in room: ", noOfClients);
  // console.log(clients);

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
        messageList,
        clientList,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
