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
import { ContextType, useSocket } from "./SocketContext";
import backgroundIMG from "./assets/background.png";
import { ReactComponent as BirdLogo } from "./assets/bird.svg";
import { AccountCircle } from "@mui/icons-material";

const NameInput = () => {
  const { socket, setLoggedIn } = useSocket() as ContextType;
  const [userName, setUserName] = useState<string>("");
  const matches = useMediaQuery("(max-width:650px)");
  const matches2 = useMediaQuery("(max-width:455px)");

  const navigate = useNavigate();

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userName.length) {
      socket!.auth = { nickname: userName };
      socket!.connect();
    } else {
      console.log("Username cannot be empty");
    }
  };

  useEffect(() => {
    //If the connection is succeded then this part runs
    socket?.on("connected", (nickname) => {
      console.log("Connected: ", nickname);
      setLoggedIn(true);
      navigate("/room");
    });
  }, [socket]);

  //If the connection part fails, this code runs, i.e the nickname is shorter than 3 characters.
  socket?.on("connect_error", (err) => {
    if (err.message === "Invalid nickname") {
      console.log("You have entered an invalid username, try again.");
    }
  });

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundIMG})`,
        height: "100vh",

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
                color: "#F4F1DE",
                mx: ".5rem",
              }}
            >
              Chirp
            </Typography>
            <BirdLogo
              fill="#F4F1DE"
              style={{
                height: "5rem",
                width: "5rem",
                position: "absolute",
                top: "1rem",
                right: "-5rem",
              }}
            />
          </Box>
          {!matches2 ? (
            <Typography
              variant="h4"
              sx={{
                color: "#F4F1DE",
                fontFamily: "League Spartan",
                fontWeight: "300",
                mx: ".5rem",
              }}
            >
              193 countries - One Chirp.
            </Typography>
          ) : (
            <Typography
              variant="h5"
              sx={{
                color: "#F4F1DE",
                fontFamily: "League Spartan",
                fontWeight: "300",
                mx: ".5rem",
              }}
            >
              193 countries - One Chirp.
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
                <AccountCircle
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
                  autoComplete="off"
                  autoCorrect="off"
                  sx={formStyling}
                  type="text"
                  value={userName}
                  onChange={updateName}
                  placeholder="Enter a username..."
                />
              </Box>
              <Button
                type="submit"
                sx={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                  backgroundColor: "#E07A5F",
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
                Save
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
                <AccountCircle
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
                  value={userName}
                  onChange={updateName}
                  placeholder="Enter a username..."
                />
              </Box>
              <Button
                type="submit"
                sx={{
                  boxShadow:
                    "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                  backgroundColor: "#E07A5F",
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
                Save
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

export default NameInput;
