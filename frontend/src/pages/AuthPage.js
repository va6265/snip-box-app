import login from "../assets/images/login.svg";
import {
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import { useLocation} from "react-router-dom";
import TextBottom from "../components/auth/TextBottom";

function AuthPage() {
  const location = useLocation().pathname.toLowerCase().split('/')[1];

  const theme = useTheme();
  const displayImage = useMediaQuery(theme.breakpoints.up("md"));
  
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          paddingY: "15vh",
          paddingX: "15vw",
          background: "linear-gradient(45deg, #fc466b, #3f5efb)",
        }}
      >
        <Box
          sx={{
            height: "70vh",
            backgroundColor: "white",
            marginX: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          {displayImage && <img src={login} alt=" " style={{ width: "50%" }} />}
          <Box
            sx={{
              width: displayImage ? "35%" : "80%",
              marginX: "auto",
            }}
          >
            <TextBottom location={location}/>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default AuthPage;
