import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';
import NavbarMainComponent from '../components/NavbarMain';
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phonenum, setPhonenum] = useState('');
  const [country, setCountry] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password === confirmPassword) {
      const userData = {
        name: name,
        email: email,
        password: password,
        phonenum: phonenum,
        country: country,
        type: 'User', 
      };

      try {
        const response = await axios.post('http://localhost:8080/api/user/register', userData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 201) {
          console.log('Registration successful', response.data);
          navigate('/login');
        }
      } catch (error) {
        console.error('Registration failed', error);
        alert('Registration failed: ' + (error.response?.data?.message || 'Unknown error'));
      }
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="register-page">
      <NavbarMainComponent />
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phonenum}
        onChange={(e) => setPhonenum(e.target.value)}
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button className="button" onClick={handleRegister}>Register</button>
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default Register;