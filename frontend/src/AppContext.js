import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a new context
const AppContext = createContext();

// Create a custom provider for the context
const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('pasteList'); // Initial value is 'pasteList'
  const [currentPasteId, setCurrentPasteId] = useState(null);

  // useEffect(() => {
  //   // Check if the user is logged in and get the user ID
  //   axios
  //     .get('http://localhost:8000/api/current_user')
  //     .then((response) => {
  //       setCurrentUserId(response.data._id);
  //     })
  //     .catch((error) => {
  //       setCurrentUserId(null);
  //       console.error('Error fetching current user:', error);
  //     });
  // }, []);

  return (
    <AppContext.Provider value={{ currentPage, setCurrentPage, currentPasteId, setCurrentPasteId}}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
