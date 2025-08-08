import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import './Navbar.css';
import logo from '../graphics/logo.png';  

function NavbarMainComponent({ isLoggedIn, userEmail }) {
  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Navbar.Brand as={Link} to="/">
        <img src={logo} alt="Predict2fly Logo" className="navbar-logo"/>
        <span>Predict2fly</span>
      </Navbar.Brand>
      <Nav>
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        {
        // isLoggedIn ? (
        //   <Nav.Link as={Link} to="/account">
        //     <FontAwesomeIcon icon={faUser} className="me-2" />
        //     {userEmail}
        //   </Nav.Link>
        // ) : (
          <Nav.Link as={Link} to="/login">
            <FontAwesomeIcon icon={faUser} className="me-2" />Log In
          </Nav.Link>
        }
      </Nav>
    </Navbar>
  );
}

export default NavbarMainComponent;