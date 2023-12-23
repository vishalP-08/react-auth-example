// Install 'react' and 'react-dom' if not already installed
// npm install react react-dom

import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,  // Use 'email' instead of 'username'
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user object including token and id in local storage
        localStorage.setItem('user', JSON.stringify(data));
        // Redirect to the profile page
        window.location.href = '/profile';
      } else {
        // Display error if login is unsuccessful
        alert(data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <p>Welcome Back! 👋</p>
        <h2>Sign in to your account</h2>

        <div>
          <label>Your email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Your password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLogin}>Continue</button>

        <div
          className="forgot-password"
          onClick={() => alert('Forgot password')}
        >
          Forgot Your password?
        </div>
      </div>

      <p className="sign-up-text">Don’t have an account? Sign up</p>
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user id from local storage
    const userId = JSON.parse(localStorage.getItem('user')).id;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/users/${userId}`);
        const userData = await response.json();

        if (response.ok) {
          // Save user object with details in local storage
          localStorage.setItem('user', JSON.stringify(userData));
          // Update user state
          setUser(userData);
        } else {
          console.error('Error fetching user profile:', userData.error);
        }
      } catch (error) {
        console.error('Error during profile fetch:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    // Remove user from local storage
    localStorage.removeItem('user');
    // Redirect to the login page
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <div>
          <p>ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          {/* Display other user details as needed */}
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

const App = () => {
  // Render either the login or profile component based on authentication status
  return localStorage.getItem('user') ? <Profile /> : <Login />;
};

export default App;
