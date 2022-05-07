import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSocket } from "./SocketContext";

const ListOfRooms = () => {
  const { rooms, currentRoom, socket, setCurrentRoom, clientList } =
    useSocket();

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
                }}
                onClick={handleSubmit}
              >
                {room.name}
              </Button>
              <div>
                {room.sockets.map((user, index) => (
                  <Typography key={index} variant="body2">
                    {user.nickname}
                  </Typography>
                ))}
              </div>
            </Box>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ListOfRooms;
