// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { createTheme, ThemeProvider } from "@mui/material";
import CreateSnip from "./components/snip/CreateSnip";
import ShowPaste from "./components/snip/ShowSnip";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import EditSnip from "./components/snip/EditSnip";
import ShowPublicSnips from './components/snip/ShowPublicSnips';
import axios from "./utils/axios"

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...theme.unstable_sx({
            ":hover": {
              transform: `translateY(${ownerState.transform}px)`,
            },
          }),
        }),
      },
    },
  },
  palette: {
    primary: {
      main: "#7400B8",
      contrastText: "#fff",
    },
    secondary: {
      main: "#fff",
      contrastText: "#7400B8",
    },
  },
});

const App = () => {
  // console.log(theme);
  return (
    // <AppProvider value={{ currentPage, setCurrentPage }}>
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/forgotPassword" element={<AuthPage />} />
        <Route path="/resetPassword/:resetToken" element={<AuthPage />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<CreateSnip />} />
          <Route path="/:snipId" element={<ShowPaste />} />
          <Route path="/u/:id" element={<Dashboard />} />
          <Route path="/edit/:snipId" element={<EditSnip />} />
          <Route path='/public' element={<ShowPublicSnips />} />
        </Route>
        {/* <Route path="/" element={<><Navbar /><CreateSnip /></>} />
        <Route path="/:snipId" element={<><Navbar /><ShowPaste /></>} />

        <Route path="/u/:id" element={<><Navbar /><Dashboard /></>} /> */}
      </Routes>
    </ThemeProvider>
    // </AppProvider>
  );
};

export default App;
