import { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  IconButton,
  Collapse,
  Snackbar,
  Zoom,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import {setCookie} from '../../utils/Cookie';

function ResetPassword() {
  const { resetToken } = useParams();

  const [inputs, setInputs] = useState({
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

    if(inputs.password !== inputs.passwordConfirm) {
      setFeedback({ ...feedback, alert: true });
      return;
    }

    try {
      const response = await axios.patch(
        `/users/resetPassword/${resetToken}`,
        inputs
      );
      setCookie('jwt',`${response.data.token}`,90);
      setFeedback({ ...feedback, snackbar: true });
      setTimeout(() => navigate("/login", {replace: true}), 1000);
    } catch (error) {
      setFeedback({ ...feedback, alert: true });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h4">Reset Password</Typography>

        <Collapse in={feedback.alert}>
          <Alert
            severity="error"
            onClose={() => {
              setFeedback({ ...feedback, alert: false });
            }}
          >
            Invalid
          </Alert>
        </Collapse>

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
            endIcon={<LoginOutlinedIcon />}
            sx={{
              borderRadius: 2,
              paddingX: 4,
              width: "fit-content",
            }}
          >
            Submit
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
          Password reseted successfully
        </Alert>
      </Snackbar>
    </>
  );
}

export default ResetPassword;
