import { Forum } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundIMG from "./assets/background-room.png";
import { useSocket } from "./SocketContext";

const RoomInput = () => {
  const { socket, setCurrentRoom } = useSocket();
  const [roomName, setRoomName] = useState<string>("");
  const navigate = useNavigate();
  const matches = useMediaQuery("(max-width:650px)");

  const updateRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomName.length) {
      socket!.emit("join", roomName);
      console.log("från under room");
      setCurrentRoom(roomName);
    } else {
      console.log("Room name cannot be empty");
    }
  };

  useEffect(() => {
    socket?.on("joined", (room) => {
      console.log("Joined room: ", room);
      navigate("/chat");
    });
  }, [socket]);

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundIMG})`,
        height: "calc(100vh - 4.5rem)",
        minHeight: "500px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
      }}
    >
      <Container
        sx={{
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "League Spartan",
                color: "#F2CC8F",
                mx: ".5rem",
              }}
            >
              Chirp
            </Typography>
          </Box>
          {!matches ? (
            <Typography
              variant="h4"
              sx={{
                color: "#F4F1DE",
                fontFamily: "League Spartan",
                fontWeight: "300",
                mx: ".5rem",
              }}
            >
              Choose from the room list or create a room below
            </Typography>
          ) : (
            <Typography
              variant="h6"
              sx={{
                color: "#F4F1DE",
                fontFamily: "League Spartan",
                fontWeight: "300",
                mx: ".5rem",
              }}
            >
              Choose from the room list or create a room below
            </Typography>
          )}

          {!matches ? (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "3rem",
                width: "60%",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Forum
                  sx={{
                    color: "#606384",
                    position: "absolute",
                    fontSize: "3rem",
                    zIndex: "2",
                    left: "10px",
                    top: "calc(50% - 1.5rem)",
                  }}
                />
                <TextField
                  fullWidth
                  inputProps={{ maxLength: 20 }}
                  autoComplete="off"
                  autoCorrect="off"
                  sx={formStyling}
                  type="text"
                  value={roomName}
                  onChange={updateRoomName}
                  placeholder="Enter a room..."
                />
              </Box>
              <Button
                type="submit"
                sx={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                  backgroundColor: "#81B29A",
                  color: "#F4F1DE",
                  fontFamily: "League Spartan",
                  borderRadius: "2rem",
                  fontWeight: "400",
                  border: "none",
                  height: "4rem",
                  width: "40%",
                  fontSize: "2rem",
                  textTransform: "capitalize",
                  marginBottom: "1rem",
                  cursor: "pointer",
                  transition: "all .15s ease-in-out",
                  "&:hover": {
                    background: "#F2CC8F",
                    transform: "scale(1.01)",
                  },
                }}
              >
                Go
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "3rem",
                width: "100%",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Forum
                  sx={{
                    color: "#606384",
                    position: "absolute",
                    fontSize: "3rem",
                    zIndex: "2",
                    left: "10px",
                    top: "calc(50% - 1.5rem)",
                  }}
                />
                <TextField
                  fullWidth
                  sx={formStyling}
                  type="text"
                  value={roomName}
                  onChange={updateRoomName}
                  placeholder="Enter a room..."
                />
              </Box>
              <Button
                type="submit"
                sx={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                  backgroundColor: "#81B29A",
                  color: "#F4F1DE",
                  fontFamily: "League Spartan",
                  borderRadius: "2rem",
                  fontWeight: "400",
                  border: "none",
                  height: "4rem",
                  width: "70%",
                  fontSize: "2rem",
                  textTransform: "capitalize",
                  marginBottom: "1rem",
                  cursor: "pointer",
                  transition: "all .15s ease-in-out",
                  "&:hover": {
                    background: "#F2CC8F",
                    transform: "scale(1.01)",
                  },
                }}
              >
                Go
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

const formStyling = {
  "& .MuiInputBase-input": {
    fontFamily: ["League Spartan", "sans-serif"].join(","),
    fontWeight: "600",
    fontSize: "1.4rem",
    padding: "1.2rem",
    paddingLeft: "5rem",
    color: "#606384",
  },

  // Normal border
  "& .MuiOutlinedInput-root": {
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
    borderRadius: "2rem",
    border: "none",
    backgroundColor: "#F4F1DE",

    "& fieldset": {
      border: "none",
    },
    // On Hover
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
};

export default RoomInput;
