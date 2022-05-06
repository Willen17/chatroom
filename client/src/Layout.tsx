import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useSocket } from "./SocketContext";

const Layout = () => {
  const { loggedIn } = useSocket();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // Different layout depending on logged in our not
  return loggedIn ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginLeft: menuIsOpen ? "200px" : "0px",
      }}
    >
      <Header setMenuIsOpen={setMenuIsOpen} />
      <Outlet />
    </Box>
  ) : (
    <Outlet />
  );
};

export default Layout;
