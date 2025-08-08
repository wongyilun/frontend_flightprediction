import React from 'react';
import { Container } from 'react-bootstrap';
import './MainPage.css';
import './About.css';
import FooterComponent from '../components/Footer.js';
import NavbarMainComponent from '../components/NavbarMain.js';
import NavbarComponent from '../components/Navbar';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';

function Membership({ isLoggedIn, userEmail, userType, setIsLoggedIn }) {
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
          <h2 className="about-title">About Membership</h2>
          <br />
          <p>
            Our membership program offers enhanced features and exclusive benefits for users seeking a more tailored travel experience. By becoming a member, you unlock advanced tools and insights to optimize your flight bookings and travel planning.
          </p>
          <h3>Membership Tiers</h3>
          <p>
            We offer different membership levels to cater to various needs:
          </p>
          <ul>
            <li><strong>Basic Member:</strong> Access essential features including flight searches, basic price views, and weather updates.</li>
            <li><strong>Premium Member:</strong> Enjoy all Basic Member benefits plus advanced predictive analytics, cancellation forecasts, and priority customer support.</li>
          </ul>
          <h3>Benefits of Membership</h3>
          <ul>
            <li>Advanced Flight Predictions: Get accurate forecasts on arrival times, ticket prices, and cancellation risks.</li>
            <li>Optimized Flight Search: Access to tools that help you find the most cost-effective and convenient flight options.</li>
            <li>Personalized Notifications: Receive timely updates on flight status, price changes, and more.</li>
            <li>Priority Support: Premium Members benefit from dedicated customer service for quicker resolutions.</li>
            <li>Exclusive Offers: Access special discounts and promotions available only to members.</li>
          </ul>
          <h3>How to Become a Member</h3>
          <p>
            Joining our membership program is simple. Choose the membership level that suits your needs and sign up through our website. For Premium Members, a subscription fee applies. Once registered, you can start enjoying the full range of benefits and features.
          </p>
          <h3>Contact Us</h3>
          <p>
            For more information about our membership options or if you have any questions, please reach out to our support team.
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

export default Membership;
