import { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Zoom,
  Collapse,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import axios from "../../utils/axios";
import {setCookie} from '../../utils/Cookie';
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
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

    if(inputs.name === '' || inputs.email === '' || inputs.password !== inputs.passwordConfirm) {
      setFeedback({ ...feedback, alert: true });
      return;
    }

    try {
      const response = await axios.post("/users/signup", inputs);
      setCookie('jwt',`${response.data.token}`,90);
      setFeedback({ ...feedback, snackbar: true });
      await axios.post("/users/login", {email: inputs.email, password: inputs.password})
      setTimeout(() => navigate("/"), 1000);
      
    } catch (error) {
      setFeedback({ ...feedback, alert: true });
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h4">Sign Up</Typography>

        <Collapse in={feedback.alert}>
          <Alert
            severity="error"
            onClose={() => {
              setFeedback({ ...feedback, alert: false });
            }}
          >
            Incorrect details
          </Alert>
        </Collapse>

        <TextField
          margin="normal"
          name="name"
          label="Name"
          type="text"
          variant="standard"
          value={inputs.name}
          onChange={handleInputsChange}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          name="email"
          label="Email"
          type="email"
          variant="standard"
          value={inputs.email}
          onChange={handleInputsChange}
          autoComplete="off"
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
        <TextField
          margin="normal"
          label="Confirm Password"
          name="passwordConfirm"
          variant="standard"
          type={showPassword ? "text" : "password"}
          value={inputs.passwordConfirm}
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
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
            endIcon={<HowToRegOutlinedIcon />}
            sx={{
              borderRadius: 2,
              paddingX: 4,
              width: "fit-content",
            }}
          >
            Sign Up
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
          Signup successful
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignUp;
