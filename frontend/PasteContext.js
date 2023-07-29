// PasteContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const PasteContext = createContext();

export const PasteProvider = ({ children }) => {
  const [pastes, setPastes] = useState([]);

  useEffect(() => {
    // Fetch pastes from the backend API and update the state
    axios.get('/api/pastes')
      .then((response) => setPastes(response.data))
      .catch((error) => console.error('Error fetching pastes:', error));
  }, []); // Empty dependency array ensures the effect runs once on component mount

  return (
    <PasteContext.Provider value={{ pastes }}>
      {children}
    </PasteContext.Provider>
  );
};
