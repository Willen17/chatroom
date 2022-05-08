import { Box, Button, Grow, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSocket } from "./SocketContext";

const ListOfRooms = () => {
  const { rooms, currentRoom, socket, setCurrentRoom, clientList } =
    useSocket();
  const [checked, setChecked] = useState(false);
  // const [target, setTarget] = useState("");
  const [expandedId, setExpandedId] = useState(-1);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.innerText);
    let theRoom = e.currentTarget.innerText;
    if (theRoom) {
      socket!.emit("leave", currentRoom);
      setCurrentRoom(theRoom);
      socket!.emit("join", theRoom);
      console.log("från under room");
    }
  };

  const handleExpandClick = (i: number) => {
    console.log("index: ", i);
    setExpandedId(expandedId === i ? -1 : i);
    console.log("expandedID: ", expandedId);
  };

  // const clickedRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   const target1 = e.currentTarget.parentElement?.firstChild?.textContent;
  //   setTarget(target1 || "");
  //   console.log("target:", target);
  //   showClients(e);
  // };

  const showClients = (e: React.MouseEvent<HTMLButtonElement>) => {
    checked ? setChecked(false) : setChecked(true);
  };

  // useEffect(() => {
  //   rooms.map((room) => socket?.emit("clients", room));
  // }, [socket]);

  console.log(clientList);
  return (
    <Box
      sx={{
        height: "100vh",
        width: "20vw",
        minWidth: "200px",
        bgcolor: "#3D405B",
      }}
    >
      <ul style={{ paddingLeft: "1rem" }}>
        {rooms.map((room, index) => (
          <li
            key={index}
            style={{
              listStyleType: "none",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  placeItems: "center",
                }}
              >
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    fontFamily: "League Spartan",
                    letterSpacing: "none",
                    textTransform: "none",
                    fontSize: "1rem",
                    color: "#F2CC8F",
                    boxShadow: "none",
                    minWidth: "auto",
                  }}
                  onClick={handleSubmit}
                >
                  {room.name}
                </Button>
                <Typography
                  key={index}
                  variant="overline"
                  color="#8184A7"
                  sx={{
                    fontFamily: "League Spartan",
                    letterSpacing: "none",
                    cursor: "pointer",
                  }}
                  onClick={showClients}
                >
                  ({room.sockets.length})
                </Typography>
              </Box>
              <Box sx={{ height: checked ? "fit-content" : 0 }}>
                {room.sockets.map((user, index) => (
                  <Grow
                    key={index}
                    // orientation="horizontal"
                    in={checked}
                    {...(checked ? { timeout: 500 } : { timeout: 0 })}
                  >
                    <Typography
                      color="#f4f1de"
                      variant="body2"
                      sx={{
                        fontFamily: "League Spartan",
                        letterSpacing: "none",
                        pl: "1rem",
                        transition: 0,
                      }}
                    >
                      {user.nickname}
                    </Typography>
                  </Grow>
                ))}
              </Box>
            </Box>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ListOfRooms;
