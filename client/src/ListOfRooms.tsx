import { Box, Button, Grow, List, ListItem, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSocket } from "./SocketContext";

const ListOfRooms = () => {
  const {
    rooms,
    currentRoom,
    socket,
    enterRoom,
    allConnectedUsers,
    handleOpenDM,
  } = useSocket();
  const [checked, setChecked] = useState(false);

  // handle click to enter room
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let theRoom = e.currentTarget.innerText;
    if (theRoom) {
      socket!.emit("leave", currentRoom);
      enterRoom(theRoom);
    }
  };

  // show the list of clients in room on click
  const showClients = () => {
    checked ? setChecked(false) : setChecked(true);
  };

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
        <Typography
          color="#f4f1de"
          variant="h5"
          sx={{
            fontFamily: "League Spartan",
            letterSpacing: "none",

            transition: 0,
          }}
        >
          All rooms
        </Typography>

        {rooms.length ? (
          rooms.map((room, index) => (
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
                      in={checked}
                      {...(checked ? { timeout: 500 } : { timeout: 0 })}
                    >
                      <Typography
                        color="#f4f1de"
                        variant="body1"
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
          ))
        ) : (
          <Typography
            color="#f4f1de"
            variant="body2"
            sx={{
              fontFamily: "League Spartan",
              letterSpacing: "none",

              transition: 0,
            }}
          >
            No rooms created... ????
          </Typography>
        )}
      </ul>
      <List sx={{ pl: "1rem" }}>
        <Typography fontFamily="League Spartan" color="#81B29A" sx={{}}>
          Online users({allConnectedUsers.length})
        </Typography>
        {allConnectedUsers.length < 1 ? (
          <ListItem>No online users</ListItem>
        ) : (
          allConnectedUsers.map((user) => (
            <ListItem key={user.userID} sx={{ padding: 0 }}>
              {/* <Link to="/newMessage" style={{ textDecoration: "none" }}> */}
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
                onClick={handleOpenDM}
              >
                {user.username}
              </Button>
              {/* </Link> */}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default ListOfRooms;
