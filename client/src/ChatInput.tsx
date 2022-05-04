import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ContextType, useSocket } from "./SocketContext";

const ChatInput = () => {
  const { socket } = useSocket() as ContextType;
  const [chatMessage, setChatMessage] = useState<string>("");
  const location = useLocation();
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
      <ul id="messages"></ul>
      <form onSubmit={handleSubmit} id="form">
        <input
          type="text"
          value={chatMessage}
          onChange={updateChatMessage}
          placeholder="Enter a room"
          id="input"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatInput;
