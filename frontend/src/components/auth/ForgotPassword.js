import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [inputs, setInputs] = useState({
    email: "",
  });
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
      const response = await axios.post(
        "/users/forgotPassword",
        inputs
      );

      console.log(response);

      setFeedback({ ...feedback, snackbar: true });
    } catch (error) {
      setFeedback({ ...feedback, alert: true });
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h4">Forgot Password</Typography>

        <Collapse in={feedback.alert}>
          <Alert
            severity="error"
            onClose={() => {
              setFeedback({ ...feedback, alert: false });
            }}
          >
            Incorrect email
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
          Reset token sent successfully
        </Alert>
      </Snackbar>
    </>
  );
}

export default ForgotPassword;
