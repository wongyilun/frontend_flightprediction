import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import NavbarMainComponent from '../components/NavbarMain';
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';

function Login({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/login',
        null,
        {
          params: {
            email: email,
            password: password,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setLoggedIn(true);
        navigate('/');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <NavbarMainComponent />
      <br />
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="login-buttons">
        <button onClick={handleLogin}>Log In</button>
        <button onClick={handleRegister}>Register</button>
      </div>
      <br />
      <br />
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default Login;