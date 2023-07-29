import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Create the payload object with email and password
    const payload = {
      email,
      password,
    };

    try {
      // Make a POST request to the /api/login endpoint using Axios
      const response = await axios.post('http://localhost:8000/api/login', payload);

      // Check if the response is successful (HTTP status code 2xx)
      if (response.status >= 200 && response.status < 300) {
        const token = response.data.token;

        // Store the JWT token in local storage or an HTTP-only cookie for subsequent requests
        // You may want to handle this securely in your application
        localStorage.setItem('jwtToken', token);

        // Redirect to the dashboard or another page after successful login
        // Replace '/dashboard' with the desired route
        window.location.href = '/';
      } else {
        // Handle login error (e.g., invalid credentials)
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
