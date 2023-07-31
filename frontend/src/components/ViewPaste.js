import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext';

const ViewPaste = () => {
  const [paste, setPaste] = useState(null);

  

  const fetchPaste = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/pastes/${currentPasteId}`);
      setPaste(response.data);
    } catch (error) {
      console.error('Error fetching paste:', error);
    }
  };

  useEffect(() => {
    // Fetch the individual paste from the backend API when the component mounts
    fetchPaste();
  }, [currentPasteId]);

  return (
    <div className="p-4">
      {paste ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{paste.title}</h1>
          <pre className="whitespace-pre-wrap bg-gray-100 rounded-md p-2 mb-4">
            {paste.content}
          </pre>
          {paste.expirationDate && (
            <p className="text-gray-600">Expiration Date: {paste.expirationDate}</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ViewPaste;
