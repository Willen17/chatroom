import { CSSProperties, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ContextType, useSocket } from "./SocketContext";

const ChatInput = () => {
  const { socket } = useSocket() as ContextType;
  const [chatMessage, setChatMessage] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const updateChatMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatMessage.length) {
      socket!.emit("message", chatMessage, state as string);
      console.log("från undre init " + chatMessage);
    } else {
      console.log("Text cannot be empty");
    }
  };

  // leave a chatroom (for now it is only showing console log)
  const leaveRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // navigate(-1)
    console.log("leave room");
  };

  useEffect(() => {
    socket?.on("message", (message, from) => {
      console.log(message, from.nickname);

      const chatItem = document.createElement("li");
      chatItem.textContent = from.nickname + ": " + message;

      const messageList = document.getElementById("messages");
      if (messageList) {
        messageList.innerHTML =
          messageList.innerHTML + `<li>${from.nickname}: ${message}</li>`;
      }

      window.scrollTo(0, document.body.scrollHeight);
    });
  }, [socket]);

  return (
    <div>
      <div style={{ background: "pink", height: "3rem", textAlign: "end" }}>
        <button style={buttonStyle} onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <ul id="messages"></ul>
      <form onSubmit={handleSubmit} id="form">
        <input
          type="text"
          value={chatMessage}
          onChange={updateChatMessage}
          id="input"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

const buttonStyle: CSSProperties = {
  background: "#333",
  border: "none",
  padding: ".6rem",
  margin: "0.25rem",
  borderRadius: "3px",
  outline: "none",
  color: "#fff",
};

export default ChatInput;
