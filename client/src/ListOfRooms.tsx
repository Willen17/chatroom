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

  useEffect(() => {
    rooms.map((room) => socket?.emit("clients", room));
  }, [socket]);

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
        {clientList.map((room, index) => (
          <li
            key={index}
            style={{
              listStyleType: "none",
            }}
          >
            <Button
              variant="text"
              size="small"
              sx={{
                fontFamily: "League Spartan",
                letterSpacing: "none",
                fontSize: "1rem",
                color: "#F2CC8F",
                boxShadow: "none",
                textTransform: "none",
                "&:hover": {
                  color: "white",
                  boxShadow: "none",
                },
              }}
              onClick={handleSubmit}
            >
              {room.room}
            </Button>
            <Typography variant="body2">{room.clients}</Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default ListOfRooms;
