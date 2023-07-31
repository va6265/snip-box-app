// CreatePasteForm.js
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../AppContext';
import Datetime from 'react-datetime';
import axios from 'axios';


import "react-datetime/css/react-datetime.css";

const CreatePasteForm = () => {
  const { setCurrentPage, currentUserId } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [privacy, setPrivacy] = useState(true);
  const [tags, setTags] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const history = useHistory(); // Get history object to redirect users

  const handleCreatePaste = async (e) => {
    e.preventDefault();

    // Check if the user is logged in (You can use any authentication check method here)
    const isLoggedIn = !!localStorage.getItem('jwtToken'); // Assuming you store the JWT token in local storage

    if (!isLoggedIn) {
      // Handle the case where the user is not logged in (e.g., show a message or redirect to login page)
      console.log('User is not logged in. Please log in to create a paste.');
      // Redirect to the login page (Replace '/login' with the actual login route)
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/pastes', {
        title,
        content,
        expirationDate,
        privacy,
        tags: tags.split(' ').map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)), // Ensure tags start with #
      });
      // Handle successful paste creation, e.g., show success message, redirect to paste list, etc.
      console.log(response.data);
      setCurrentPage('pasteList'); // Redirect to paste list after creating a paste
    } catch (error) {
      console.error('Failed to create paste:', error.response.data);
    }
  };


  return (
    <div>
      <h2>Create Paste</h2>
      <form onSubmit={handleCreatePaste}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Content:</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          <label>Expiration Date:</label>
          <Datetime />
        </div>
        <div>
          <label>Privacy:</label>
          <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
        </div>
        <div>
          <label>Tags:</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <button type="submit">Create Paste</button>
      </form>
    </div>
  );
};

export default CreatePasteForm;
