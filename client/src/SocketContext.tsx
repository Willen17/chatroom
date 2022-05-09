import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import {
  ChatRoom,
  ClientToServerEvents,
  ServerToClientEvents,
  Users,
} from "../../types";

interface ContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  nickname: string;
  rooms: ChatRoom[];
  setCurrentRoom: React.Dispatch<React.SetStateAction<string>>;
  currentRoom: string;
  isTypingBlock: string;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  leaveRoom: () => void;
  messageList: MessageType[];
  currentUser: Users;
  allConnectedUsers: Users[];
}

interface MessageType {
  message: string;
  from: string;
}

type Props = {
  children: React.ReactNode;
};

export const SocketContext = createContext<ContextType>({
  socket: undefined,
  nickname: "",
  rooms: [],
  setCurrentRoom: () => {},
  currentRoom: "",
  isTypingBlock: "",
  loggedIn: false,
  setLoggedIn: () => {},
  leaveRoom: () => {},
  messageList: [],
  currentUser: { userID: "", username: "" },
  allConnectedUsers: [],
});

const SocketProvider: React.FC<Props> = ({ children }) => {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(
    () => {
      return io({
        autoConnect: false,
        path: "/socket",
      });
    }
  );
  const [nickname, setNickname] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isTypingBlock, setIsTypingBlock] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<MessageType[]>([]);
  const [currentUser, setCurrentUser] = useState<Users>({
    userID: "",
    username: "",
  });
  const [allConnectedUsers, setAllConnectedUsers] = useState<Users[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    //If the connection is succeded then this part runs
    socket?.on("connected", (newUser) => {
      setNickname(newUser.username);
      setLoggedIn(true);

      navigate("/room");
    });

    //If the connection part fails, this code runs, i.e the nickname is shorter than 3 characters.
    socket?.on("connect_error", (err) => {
      if (err.message === "Invalid nickname") {
        console.log("You have entered an invalid username, try again.");
      }
    });

    socket.on("users", (users) => {
      users.forEach((user) => {
        if (user.userID === socket.id) {
          setCurrentUser(user);
        }
      });
      setAllConnectedUsers(users);
    });

    // to list all rooms, put in a use effect
    socket.on("roomList", (listofRooms) => {
      console.log(listofRooms);

      setRooms(listofRooms);
    });

    // receive the new message and update in the state
    socket.on("message", (message, from) => {
      let messageObject: MessageType = {
        message: message,
        from: from.nickname,
      };
      setMessageList((messagesList) => [...messagesList, messageObject]);
    });

    // fetch the typing status of user
    socket.on("isTypingIndicator", (nickname: string) => {
      if (nickname) {
        setIsTypingBlock(`${nickname} is typing...`);
        setTimeout(() => setIsTypingBlock(""), 2000);
      }
    });

    // set leave room of user
    socket.on("left", (room) => {
      console.log("Left room: ", room);
      navigate("/room");
    });
  }, [socket]);

  // leave a chatroom and be redirected to roomInput
  const leaveRoom = () => {
    socket!.emit("leave", currentRoom);
  };

  console.log(allConnectedUsers);
  console.log(currentUser);

  return (
    <SocketContext.Provider
      value={{
        socket,
        nickname,
        rooms,
        setCurrentRoom,
        currentRoom,
        isTypingBlock,
        loggedIn,
        setLoggedIn,
        leaveRoom,
        messageList,
        currentUser,
        allConnectedUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
