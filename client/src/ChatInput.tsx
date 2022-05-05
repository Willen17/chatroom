import { CSSProperties, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IsTypingBlock from "./components/IsTypingBlock";
import { ContextType, useSocket } from "./SocketContext";

const ChatInput = () => {
  const { socket, currentRoom } = useSocket() as ContextType;
  const [chatMessage, setChatMessage] = useState<string>("");
  const navigate = useNavigate();

  const updateChatMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatMessage.length) {
      socket!.emit("message", chatMessage, currentRoom as string);
      console.log("från undre init " + chatMessage);
    } else {
      console.log("Text cannot be empty");
    }
  };

  // leave a chatroom and be redirected to roomInput
  const leaveRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    socket!.emit("leave", currentRoom);
    setInterval(() => {
      navigate("/room");
    }, 1500);
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
    <div style={{ width: "80vw" }}>
      <div style={{ background: "pink", height: "3rem", textAlign: "end" }}>
        <button style={buttonStyle} onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <ul id="messages"></ul>
      <div style={blockAndFormDivStyle}>
        <IsTypingBlock />
        <form onSubmit={handleSubmit} id="form">
          <input
            type="text"
            value={chatMessage}
            onChange={updateChatMessage}
            onKeyDown={() => {
              socket?.emit("typing");
            }}
            id="input"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

const blockAndFormDivStyle: CSSProperties = {
  padding: "0.25rem",
  position: "fixed",
  bottom: 0,
  left: "20vw",
  right: 0,
  display: "flex",
  flexDirection: "column",
  height: "4.5rem",
  boxSizing: "border-box",
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
