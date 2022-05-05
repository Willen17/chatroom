import { Logout, Send } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";
import IsTypingBlock from "./components/IsTypingBlock";
import { ContextType, useSocket } from "./SocketContext";

const ChatInput = () => {
  const { socket, currentRoom, leaveRoom, messageList } =
    useSocket() as ContextType;
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
    const messageList = document.getElementById("messages");
    messageList!.innerHTML = "";
  }, [currentRoom]);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        zIndex: 99,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          background: "#F4F1DE",
          height: "3rem",
          textAlign: "end",
          placeItems: "center",
        }}
      >
        <Typography
          variant="h5"
          fontFamily="League Spartan"
          sx={{
            width: 1,
            textAlign: "center",
            ml: "4rem",
            textTransform: "capitalize",
          }}
        >
          {currentRoom}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            fontFamily: "League Spartan",
            textTransform: "Capitalize",
            background: "#E07A5F",
            border: "none",
            padding: ".4rem",
            margin: "0.25rem",
            borderRadius: "8px",
            outline: "none",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
              color: "#F4F1DE",
              boxShadow: "none",
            },
          }}
          onClick={leaveRoom}
        >
          <Logout fontSize="small" />
        </Button>
      </Box>

      <ul
        id="messages"
        style={{
          listStyleType: "none",
          margin: 0,
          padding: 0,
          height: "80vh",
          overflowY: "scroll",
        }}
      >
        {messageList?.map((message, index) => (
          <li key={index}>
            {message.from}: {message.message}
          </li>
        ))}
      </ul>

      <div style={blockAndFormDivStyle}>
        <IsTypingBlock />
        <form
          onSubmit={handleSubmit}
          id="form"
          style={{
            background: "#3d405b",
            padding: "0.5rem",
            gap: "0.5rem",
            position: "fixed",
            bottom: 0,
            width: "100%",
            right: 0,
            display: "flex",
            boxSizing: "border-box",
            backdropFilter: "blur(10px)",
          }}
        >
          <input
            type="text"
            value={chatMessage}
            onChange={updateChatMessage}
            onKeyDown={() => {
              socket?.emit("typing");
            }}
            id="input"
            style={{
              border: "none",
              padding: "0 0.8rem",
              flexGrow: 1,
              borderRadius: "8px",
              margin: "0.25rem",
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{
              fontFamily: "League Spartan",
              textTransform: "Capitalize",
              background: "#81B29A",
              border: "none",
              padding: ".4rem",
              margin: "0.25rem",
              borderRadius: "8px",
              outline: "none",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#333",
                color: "#F4F1DE",
                boxShadow: "none",
              },
            }}
          >
            <Send fontSize="small" />
          </Button>
        </form>
      </div>
    </Box>
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

export default ChatInput;
