import { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  IconButton,
  Alert,
  Snackbar,
  Zoom,
  Collapse,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState({
    alert: false,
    snackbar: false,
  });

  const navigate = useNavigate();

  const handleInputsChange = (event) => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/users/login', inputs);

      console.log(document.cookie);
      setFeedback({ ...feedback, snackbar: true });
      setTimeout(() => navigate("/", { replace: true }), 1000);
    } catch (error) {
      setFeedback({ ...feedback, alert: true });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h4">Login</Typography>

        <Collapse in={feedback.alert}>
          <Alert
            severity="error"
            onClose={() => {
              setFeedback({ ...feedback, alert: false });
            }}
          >
            Incorrect email id or password
          </Alert>
        </Collapse>

        <TextField
          margin="normal"
          name="email"
          label="Email"
          type="email"
          variant="standard"
          value={inputs.email}
          onChange={handleInputsChange}
          autoComplete="on"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          label="Password"
          name="password"
          variant="standard"
          type={showPassword ? "text" : "password"}
          value={inputs.password}
          onChange={handleInputsChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Link
            variant="caption"
            underline="none"
            color="inherit"
            onClick={() => navigate("/forgotPassword", { replace: true })}
          >
            Forgot password?
          </Link>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
            endIcon={<LoginOutlinedIcon fontSize=""/>}
            sx={{
              borderRadius: 2,
              paddingX: 4,
              width: "fit-content",
            }}
          >
            Log In
          </Button>
        </Box>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={feedback.snackbar}
        autoHideDuration={2000}
        onClose={() => setFeedback({ ...feedback, snackbar: false })}
        TransitionComponent={Zoom}
      >
        <Alert variant="standard" severity="success" sx={{ width: "100%" }}>
          Login successful
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
