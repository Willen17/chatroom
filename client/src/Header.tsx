import { ChevronLeft, ChevronRight, Sms } from "@mui/icons-material";
import { AppBar, Box, Drawer, IconButton, Toolbar } from "@mui/material";
import React, { useState } from "react";
import { ReactComponent as BirdLogo } from "./assets/bird.svg";
import ListOfRooms from "./ListOfRooms";

interface Props {
  setMenuIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = (props: Props) => {
  const [openMenu, setOpenMenu] = useState(false);
  const handleMenuOpen = () => {
    setOpenMenu(true);
    props.setMenuIsOpen(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
    props.setMenuIsOpen(false);
  };

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: "#3D405B",
        display: "flex",
        flexDirection: "row",
        height: "4.5rem",
        position: "sticky",
        width: 1,
      }}
    >
      <Toolbar
        sx={{
          width: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* below is header left  */}
        <Box
          sx={
            openMenu
              ? {
                  display: "flex",
                  gap: "1.5rem",
                  flexDirection: "row",
                  marginLeft: -5,
                }
              : {
                  display: "flex",
                  gap: { xs: "1rem", sm: "1.5rem" },
                  flexDirection: "row",
                }
          }
        >
          <IconButton
            size="small"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={
              openMenu ? { display: "none" } : { color: "#989C9C", width: 50 }
            }
          >
            <Sms sx={{ color: "#F2CC8F" }} />
          </IconButton>
        </Box>
        <Box
          style={{
            textAlign: "center",
            width: "100%",
            marginRight: "4rem",
          }}
        >
          <BirdLogo
            fill="#F4F1DE"
            style={{
              height: "40px",
              width: "40px",
            }}
          />
        </Box>

        {/* below is the drawer */}
        <Drawer variant="temporary" anchor="left" open={openMenu}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 2,
              justifyContent: "flex-end",
              minWidth: 160,
            }}
          >
            <IconButton onClick={handleMenuClose}>
              {openMenu ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Box>
          <ListOfRooms />
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
