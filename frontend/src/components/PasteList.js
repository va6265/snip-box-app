import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../AppContext';

const PasteList = () => {
  const {currentPage, setCurrentPage, setCurrentPasteId } = useContext(AppContext);
  const [pastes, setPastes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentPage === 'pasteList') {
      // Fetch public and private pastes when on the pasteList page
      setLoading(true);
      axios.get('http://localhost:8000/api/pastes/public')
        .then((response) => {
          const publicPastes = response.data;
          axios.get('http://localhost:8000/api/pastes/private')
            .then((response) => {
              const privatePastes = response.data;
              setPastes([...publicPastes, ...privatePastes]);
              setLoading(false);
            })
            .catch((error) => console.error('Error fetching private pastes:', error));
        })
        .catch((error) => console.error('Error fetching public pastes:', error));
    }
  }, [currentPage, setPastes]);


  const handlePostClick = (newPasteId) => {
    setCurrentPasteId(newPasteId); // Set the selected paste ID in the context
    setCurrentPage('viewPaste');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" >Paste List</h1>
      {pastes.length > 0 ? (
        <ul className="space-y-4">
          {pastes.map((paste) => (
            <li key={paste._id} onClick={()=>handlePostClick(paste._id)} data-pasteid={paste._id} className="cursor-pointer hover:underline">
              {paste.id}
              {paste.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pastes available.</p>
      )}
    </div>
  );
};

export default PasteList;
