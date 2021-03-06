import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import {
  ChatRoom,
  ClientToServerEvents,
  DirectMessage,
  MessageType,
  ServerToClientEvents,
  User,
} from "../../types";

interface ContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;
  rooms: ChatRoom[];
  enterRoom: (room: string) => void;
  currentRoom: string;
  isTypingBlock: string;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  leaveRoom: () => void;
  leaveDm: () => void;
  messageList: MessageType[];
  dmList: DirectMessage[];
  currentUser: User;
  allConnectedUsers: User[];
  handleOpenDM: (e: React.MouseEvent<HTMLButtonElement>) => void;
  recipientID: string;
}

type Props = {
  children: React.ReactNode;
};

export const SocketContext = createContext<ContextType>({
  socket: undefined,
  rooms: [],
  enterRoom: () => {},
  currentRoom: "",
  isTypingBlock: "",
  loggedIn: false,
  setLoggedIn: () => {},
  leaveRoom: () => {},
  leaveDm: () => {},
  messageList: [],
  currentUser: { userID: "", username: "", isConnected: false, socketID: "" },
  allConnectedUsers: [],
  handleOpenDM: () => {},
  recipientID: "",
  dmList: [{ content: "", from: "" }],
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
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isTypingBlock, setIsTypingBlock] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<MessageType[]>([]);
  const [dmList, setDmList] = useState<DirectMessage[]>([]); //map thing <Map<DirectMessage[]>>
  const [currentUser, setCurrentUser] = useState<User>({
    userID: "",
    username: "",
    isConnected: false,
    socketID: "",
  });
  const [recipientID, setRecipientID] = useState<string>("");
  const [allConnectedUsers, setAllConnectedUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const allConnectedUsersRef = useRef(allConnectedUsers);
  const currentUserRef = useRef(currentUser);
  const recipientIdRef = useRef(recipientID);
  const currentRoomRef = useRef(currentRoom);

  useEffect(() => {
    // use useRef to get the content of the state within the useEffect
    allConnectedUsersRef.current = allConnectedUsers;
    currentUserRef.current = currentUser;
    recipientIdRef.current = recipientID;
    currentRoomRef.current = currentRoom;
  });

  useEffect(() => {
    // if the connection is succeded then this part runs
    socket?.on("connected", (newUser) => {
      setCurrentUser(newUser);
      setLoggedIn(true);

      // get prevChat in local storage
      const prevChat = localStorage.getItem("prevChat");
      // if nothing found
      if (!prevChat || prevChat === "") {
        navigate("/room");
      } else {
        // less than 20 means it is not an ID but a room name
        if (prevChat.length < 20) {
          enterRoom(prevChat);
        } else {
          // enter DM
          setRecipientID(prevChat);
          socket.emit("getPrivateMessageHistory", prevChat, newUser.userID);
          setTimeout(() => {
            navigate("/dm");
          }, 1000);
        }
      }
    });

    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }

    // attach the session ID to the next reconnection attempts and store it in the localStorage
    socket.on("initSession", ({ sessionID, userID }) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
    });

    // if the connection part fails, this code runs, i.e the nickname is shorter than 3 characters.
    socket?.on("connect_error", (err) => {
      if (err.message === "Invalid nickname")
        console.log("You have entered an invalid username, try again.");
    });

    // save all connected user to a state
    socket?.on("users", (users) => {
      setAllConnectedUsers(users);
    });

    // to list all rooms, put in a use effect
    socket.on("roomList", (listofRooms) => {
      setRooms(listofRooms);
    });

    // receive the new message and update in the state
    socket.on("message", (message, from) => {
      let messageObject: MessageType = {
        message: message,
        from: from.id,
      };
      setMessageList((messagesList) => [...messagesList, messageObject]);
    });

    // retrieve the room history and navigate the user to chat
    socket?.on("joined", (room) => {
      socket.emit("getRoomMessageHistory", room);
      navigate("/chat");
    });

    // fetch the typing status of user
    socket.on(
      "isTypingIndicator",
      (nickname: string, privateChat?: boolean) => {
        if (privateChat) {
          let userWhoIsTyping = allConnectedUsersRef.current.find(
            (user) => user.username === nickname
          );
          if (userWhoIsTyping?.userID === recipientIdRef.current) {
            setIsTypingBlock(`${nickname} is typing...`);
            setTimeout(() => setIsTypingBlock(""), 2000);
            return;
          } else return;
        } else {
          setIsTypingBlock(`${nickname} is typing...`);
          setTimeout(() => setIsTypingBlock(""), 2000);
        }
      }
    );

    // retrive the dm history between 2 clients and navigate
    socket.on("sendUserID", (otherUserID) => {
      setRecipientID(otherUserID);
      socket.emit(
        "getPrivateMessageHistory",
        otherUserID,
        currentUserRef.current.userID
      );

      localStorage.setItem("prevChat", otherUserID);

      setTimeout(() => {
        navigate("/dm");
      }, 1000);
    });

    // set leave room of user
    socket.on("left", (room) => {
      if (!recipientIdRef.current) {
        navigate("/room");
      }
      return;
    });

    // send private message between connected users
    socket.on("privateMessage", (content, from) => {
      let messageObject: DirectMessage = {
        content,
        from,
      };
      if (from === currentUserRef.current.userID) {
        setDmList((dmList) => [...dmList, messageObject]);
      } else {
        let username = allConnectedUsersRef.current.find(
          (user) => user.userID === from
        );
        console.log(`New message from ${username?.username}`); // console.log for now
        if (from === recipientIdRef.current) {
          setDmList((dmList) => [...dmList, messageObject]);
        } else {
          console.log("error", from, recipientID);
        }
      }
    });
  }, [socket]);

  useEffect(() => {
    // add the room message history to a state if it is not empty
    socket.on("sendRoomMessageHistory", (history) => {
      if (history) {
        setMessageList(history);
      } else setMessageList([]);
    });
  }, [currentRoom]);

  useEffect(() => {
    // add the private message history to a state if it is not empty
    socket.on("sendPrivateMessageHistory", (messagesHistory) => {
      if (messagesHistory) {
        setDmList(messagesHistory);
      } else setDmList([]);
    });
  }, [recipientID]);

  // set current room to a state and inform the serve "join"
  const enterRoom = (room: string) => {
    if (currentRoomRef.current) {
      socket!.emit("leave", currentRoom);
    }
    setRecipientID("");
    setCurrentRoom(room);
    localStorage.setItem("prevChat", room);
    socket!.emit("join", room);
  };

  // leave a chatroom and be redirected to roomInput
  const leaveRoom = () => {
    localStorage.setItem("prevChat", "");
    socket!.emit("leave", currentRoom);
    setCurrentRoom("");
  };

  const leaveDm = () => {
    localStorage.setItem("prevChat", "");
    setRecipientID("");
    navigate("/room");
  };

  // handle open DM when a user clicks on a user name on the user list
  const handleOpenDM = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let selectedUser = e.currentTarget.innerText;
    leaveRoom();
    socket.emit("getUserID", selectedUser);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        rooms,
        enterRoom,
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
        leaveDm,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
export const useSocket = () => useContext(SocketContext);
