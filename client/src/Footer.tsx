import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        m: "-1.4rem auto 0 auto",
        color: "#F4F1DE",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
        }}
      >
        <Typography
          sx={{
            cursor: "pointer",
            fontFamily: "League Spartan",
            fontSize: { xs: "10px", sm: "12px", md: "14px" },
            wordWrap: "normal",
          }}
        >
          Terms & Conditions
        </Typography>
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            fontFamily: "League Spartan",
            fontSize: { xs: "10px", sm: "12px", md: "14px" },
          }}
        >
          Privacy Policy
        </Typography>
        <Typography
          variant="body2"
          sx={{
            cursor: "pointer",
            fontFamily: "League Spartan",
            fontSize: { xs: "10px", sm: "12px", md: "14px" },
          }}
        >
          Contact
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "League Spartan",
            fontSize: { xs: "10px", sm: "12px", md: "14px" },
          }}
        >
          Chirp © 2022
        </Typography>
      </Box>
    </Container>
  );
};

export default Footer;
