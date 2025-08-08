import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import './Navbar.css';
import logo from '../graphics/logo.png';  

function NavbarComponent({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/user/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/account');
    } else {
      navigate('/login');
    }
  };

  const handlePredictionClick = () => {
    if (isLoggedIn) {
      navigate('/prediction');
    } else {
      alert('You must be logged in as a user to access the Prediction page.');
      navigate('/login');
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Navbar.Brand as={Link} to="/">
        <img src={logo} alt="Predict2fly Logo" className="navbar-logo"/>
        <span>Predict2fly</span>
      </Navbar.Brand>
      <Nav>
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/ticket-search">Ticket Search</Nav.Link>
        <Nav.Link as={Link} to="/flight-tracker">Flight Tracker</Nav.Link>

        <Nav.Link onClick={handlePredictionClick}>Prediction</Nav.Link>

        <Nav.Link onClick={handleAccountClick}>Account</Nav.Link>

        {isLoggedIn ? (
          <Button 
            variant="outline-secondary" 
            className="auth-button"
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button 
            variant="outline-secondary" 
            className="auth-button" 
            as={Link} to="/login"
          >
            Login
          </Button>
        )}

          <Button 
            variant="outline-secondary" 
            className="notification-button" 
            onClick={() => {
              if (isLoggedIn) {
                navigate('/favorites');
              } else {
                alert('You must be logged in as a user to access the Favorites page.');
                navigate('/login');
              }
            }}
          >
            <FontAwesomeIcon icon={faBell} />
          </Button>
      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;