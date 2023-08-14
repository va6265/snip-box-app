import {
  Box,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Login from "./Login";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const TextBottom = ({location}) => {

  const navigate = useNavigate();

  const renderedTextBottom = {
    login: {
      text: `Don't have an account?`,
      link: `SignUp`,
      spacing: 8,
    },
    signup: {
      text: `Already have an account?`,
      link: `LogIn`,
      spacing: 6,
    },
    forgotpassword: {
      text: `Go back to `,
      link: `LogIn`,
      spacing: 12,
    },
    resetpassword: {
      spacing: 12,
    },
  };

  const renderedComponent = () => {
    switch (location) {
      case "login":
        return <Login />;
      case "signup":
        return <SignUp />;
      case "forgotpassword":
        return <ForgotPassword />;
      case "resetpassword":
        return <ResetPassword />;
      default:
        break;
    }
  };

  return (
    <form>
      <Stack spacing={renderedTextBottom[location].spacing}>
        {renderedComponent()}
        {location !== "resetpassword" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" marginRight={1}>
              {renderedTextBottom[location].text}
            </Typography>
            <Link
              color="inherit"
              variant="caption"
              onClick={()=>navigate(`/${renderedTextBottom[location].link.toLowerCase()}`, {replace: true})}
            >
              {renderedTextBottom[location].link}
            </Link>
          </Box>
        )}
      </Stack>
    </form>
  );
};

export default TextBottom;
