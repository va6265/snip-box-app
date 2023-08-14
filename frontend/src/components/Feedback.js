import { Alert, Snackbar, Zoom } from "@mui/material";

function Feedback({ message, open, setOpen }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={2000}
      onClose={() => setOpen(false)}
      TransitionComponent={Zoom}
    >
      <Alert variant="standard" severity={message.type} sx={{ width: "100%" }}>
        {message.text}
      </Alert>
    </Snackbar>
  );
}

export default Feedback;
