import React from 'react';
import { Container } from 'react-bootstrap';
import './MainPage.css';
import './About.css';
import FooterComponent from '../components/Footer.js';
import NavbarMainComponent from '../components/NavbarMain.js';
import NavbarComponent from '../components/Navbar';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';

function About({ isLoggedIn, userEmail, userType, setIsLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <NavbarMainComponent isLoggedIn={isLoggedIn} userEmail={userEmail} />
      )}
      <Container fluid className="main-page">
        <div className="about-section">
          <br />
          <h2 className="about-title">About Us</h2>
          <br />
          <p>
            Founded in 2024, Predict2fly is a platform transforming how travelers book flights. We use advanced technology and machine learning to provide insights on flight delays, ticket prices, and travel optimization.
          </p>
          <h3>Our Vision</h3>
          <p>
            We aim to make travel planning easier and more cost-effective, helping travelers navigate flight options and reduce stress through innovative solutions.
          </p>
          <h3>What We Do</h3>
          <p>
            We predict flight arrival times, ticket prices, and cancellation risks. Our platform also helps users find the best flight options and provides real-time weather updates.
          </p>
          <h3>Key Features</h3>
          <ul>
            <li>Arrival time predictions</li>
            <li>Ticket price forecasts</li>
            <li>Cancellation risk analysis</li>
            <li>Flight optimization tools</li>
            <li>Weather updates</li>
          </ul>
          <h3>Our Technology</h3>
          <p>
            We use Java Spring Boot for web development and Android for mobile platforms. Our technology delivers accurate predictions using APIs and historical flight data.
          </p>
          <h3>Extra Features</h3>
          <ul>
            <li>Weather system integration</li>
            <li>Permissions management</li>
            <li>Blockchain integration (optional)</li>
          </ul>
          <h3>Our Team</h3>
          <p>
            Our diverse team of experts in data science, software development, and user experience design is dedicated to improving travel experiences.
          </p>
          <h3>Join Us</h3>
          <p>
            Explore our platform to find the best flight deals or learn more about our technology. For more information, contact us or visit our website.
          </p>
          <br />
          <br />
        </div>
        <FooterComponent />
        <ChatbotComponent />
      </Container>
    </div>
  );
}

export default About;
