import { Box, Button, Typography } from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";
import IsTypingBlock from "./components/IsTypingBlock";
import { ContextType, useSocket } from "./SocketContext";

const ChatInput = () => {
  const { socket, currentRoom, leaveRoom } = useSocket() as ContextType;
  const [chatMessage, setChatMessage] = useState<string>("");

  const updateChatMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatMessage.length) {
      socket!.emit("message", chatMessage, currentRoom as string);
      setChatMessage("");
    } else {
      return;
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

  useEffect(() => {
    const messageList = document.getElementById("messages");
    messageList!.innerHTML = "";
  }, [currentRoom]);

  return (
    <div style={{ width: "80vw" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          background: "#3D405B",
          height: "3rem",
          textAlign: "end",
          placeItems: "center",
        }}
      >
        <Typography variant="h5" fontFamily="League Spartan">
          {currentRoom}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            fontFamily: "League Spartan",
            textTransform: "Capitalize",
            background: "#333",
            border: "none",
            padding: ".6rem",
            margin: "0.25rem",
            borderRadius: "3px",
            outline: "none",
            color: "#fff",
          }}
          onClick={leaveRoom}
        >
          Leave
        </Button>
      </Box>
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
