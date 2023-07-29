import React, { useState } from 'react';
import axios from 'axios';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/signup', { email, password });
      setSuccessMessage(response.data.message);
      setRedirect(true); // Redirect after successful signup
    } catch (error) {
      console.error('Signup failed:', error.response.data);
    }
  };

  // Redirect to login page after successful signup
  if (redirect) {
    return (
      <div>
        <h2>Signup Successful!</h2>
        <p>{successMessage}</p>
        <p>Redirecting to login page...</p>
        {/* Redirect to login page */}
        {setTimeout(() => {
          window.location.href = '/login';
        }, 2000)}
      </div>
    );
  }

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupPage;
