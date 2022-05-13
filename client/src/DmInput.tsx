import { Logout, Send } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";
import IsTypingBlock from "./components/IsTypingBlock";
import { useSocket } from "./SocketContext";

const DmInput = () => {
  const {
    socket,
    leaveDm,
    dmList,
    recipientID,
    currentUser,
    allConnectedUsers,
  } = useSocket();
  const [chatMessage, setChatMessage] = useState<string>("");

  // save the input value to a state
  const updateChatMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatMessage(e.target.value);
  };

  useEffect(() => {
    const msgElement = document.getElementById("messages");
    msgElement!.scrollTo(0, msgElement!.scrollHeight);
  }, [dmList]);

  // handle send message
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chatMessage.length) {
      socket!.emit("privateMessage", chatMessage, recipientID);
      setChatMessage("");
    } else {
      return;
    }
  };

  // get username from userID
  const getUserName = (id: string) => {
    let user = allConnectedUsers.find((user) => user.userID === id);
    return user?.username;
  };

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
            textTransform: "none",
          }}
        >
          {getUserName(recipientID)}
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
          onClick={leaveDm}
        >
          <Logout fontSize="small" />
        </Button>
      </Box>

      <ul
        id="messages"
        style={{
          listStyleType: "none",
          marginBottom: "3rem",
          marginTop: 0,
          padding: "1rem .5rem",
          height: "calc(100vh - 15rem)",
          overflowY: "scroll",
          scrollBehavior: "smooth",
        }}
      >
        {dmList?.map((message, index) => (
          <li key={index} style={{ marginBottom: "5rem" }}>
            {message.from === currentUser.userID ? (
              <Box
                sx={{
                  bgcolor: "#606384",
                  borderRadius: "20px",
                  height: "fit-content",
                  padding: ".8rem 1rem",
                  width: "60%",
                  minWidth: "250px",
                  float: "right",
                  mb: "1rem",
                }}
              >
                <Typography
                  fontFamily="League Spartan"
                  variant="body2"
                  color="#F4F1DE"
                  sx={{ textAlign: "end" }}
                >
                  <span style={{ color: "#F2CC8F", fontSize: "12px" }}>
                    You <br />
                  </span>{" "}
                  {message.content}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  bgcolor: "#F4F1DE",
                  borderRadius: "20px",
                  height: "fit-content",
                  padding: "1rem",
                  width: "60%",
                  minWidth: "250px",
                  float: "left",
                  mb: "1rem",
                }}
              >
                <Typography
                  fontFamily="League Spartan"
                  variant="body2"
                  color="#3D405B"
                >
                  <span style={{ color: "#606384", fontSize: "12px" }}>
                    {getUserName(message.from)} <br />
                  </span>{" "}
                  {message.content}
                </Typography>
              </Box>
            )}
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
            autoComplete="off"
            value={chatMessage}
            onChange={updateChatMessage}
            onKeyDown={() => {
              socket?.emit("typing", recipientID, true);
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
  left: "0vw",
  right: 0,
  display: "flex",
  flexDirection: "column",
  height: "5rem",
  boxSizing: "border-box",
};

export default DmInput;
