import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { ContextType, useSocket } from "./SocketContext";

const ListOfRooms = () => {
  const { rooms, currentRoom, socket, setCurrentRoom, clients, clientList } =
    useSocket() as ContextType;

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
    rooms.map((room) => {
      socket?.emit("clients", room);
    });

    console.log(clientList);
  }, [socket]);

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
              {room}
            </Button>
          </li>
        ))}
        <div>
          {clientList.map((client) => (
            <div>
              <p>{client.room}</p>
              <p>{client.clients}</p>
            </div>
          ))}
        </div>
      </ul>
    </Box>
  );
};

export default ListOfRooms;
