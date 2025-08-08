import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/image/website_logo.png" alt="Predict2fly Logo" />
        <h1>Predict2fly</h1>
      </div>
      <nav className="nav">
        <a href="/">HOME</a>
        <a href="/">FLIGHT TRACKER</a>
        <a href="/">ACCOUNT</a>
        <a href="/">LOGOUT</a>
      </nav>
      <div className="notification">
        <img src="/image/Notification.png" alt="Notifications" />
      </div>
    </header>
  );
};

export default Header;
