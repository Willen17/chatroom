import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import {
  ChatRoom,
  ClientToServerEvents,
  DirectMessage,
  ServerToClientEvents,
  User,
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
  dmList: DirectMessage[];
  currentUser: User;
  allConnectedUsers: User[];
  handleOpenDM: (e: React.MouseEvent<HTMLButtonElement>) => void;
  recipientID: string;
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
  handleOpenDM: () => {},
  recipientID: "",
  dmList: [{ content: "", from: "" }],
});

// {
//   'Millie': []
//   'David': []
//   'My': []
// }

// const object: {[key: string]: DirectMessage[]} = {}
// const map = new Map<string, DirectMessage[]>()
// map.get('David')

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
  const [dmList, setDmList] = useState<DirectMessage[]>([]); //map thing <Map<DirectMessage[]>>
  const [currentUser, setCurrentUser] = useState<User>({
    userID: "",
    username: "",
  });
  const [recipientID, setRecipientID] = useState<string>("");
  const [allConnectedUsers, setAllConnectedUsers] = useState<User[]>([]);
  const [userNameAlreadySelected, setUsernameAlreadySelected] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const allConnectedUsersRef = useRef(allConnectedUsers);
  const currentUserRef = useRef(currentUser);
  const recipientIdRef = useRef(recipientID);

  useEffect(() => {
    allConnectedUsersRef.current = allConnectedUsers;
    currentUserRef.current = currentUser;
    recipientIdRef.current = recipientID;
  });

  useEffect(() => {
    //If the connection is succeded then this part runs
    socket?.on("connected", (newUser) => {
      setNickname(newUser.username);
      setCurrentUser(newUser);
      setLoggedIn(true);
      navigate("/room");
    });

    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      setUsernameAlreadySelected(true);
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("initSession", ({ sessionID, userID }) => {
      console.log(sessionID + "this userID: ", userID);
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };

      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);

      // save the ID of the user
      // socket.userID = userID
    });

    //If the connection part fails, this code runs, i.e the nickname is shorter than 3 characters.
    socket?.on("connect_error", (err) => {
      if (err.message === "Invalid nickname") {
        console.log("You have entered an invalid username, try again.");
      }
    });

    socket?.on("users", (users) => {
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

    socket.on("sendUserID", (userID) => {
      setRecipientID(userID);
      setTimeout(() => {
        navigate("/dm");
      }, 500);
    });

    // set leave room of user
    socket.on("left", (room) => {
      console.log("Left room: ", room);
      navigate("/room");
    });

    // send private message between connected users
    socket.on("privateMessage", (content, from) => {
      if (from === currentUserRef.current.userID) {
        console.log("from self");
      } else {
        let username = allConnectedUsersRef.current.find(
          (user) => user.userID === from
        );
        console.log(`New message from ${username?.username}`);
      }

      let messageObject: DirectMessage = {
        content,
        from,
      };
      setDmList((dmList) => [...dmList, messageObject]);
    });
  }, [socket]);

  // leave a chatroom and be redirected to roomInput
  const leaveRoom = () => {
    socket!.emit("leave", currentRoom);
  };

  const handleOpenDM = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let selectedUser = e.currentTarget.innerText;
    console.log(selectedUser);

    socket.emit("getUserID", selectedUser);
  };

  // console.log(dmList);
  // console.log(messageList);
  // console.log(allConnectedUsers);
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
        handleOpenDM,
        recipientID,
        dmList,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
