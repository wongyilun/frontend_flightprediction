import React from 'react';
import { Container, Row, Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import FooterComponent from '../components/Footer.js';
import NavbarMainComponent from '../components/NavbarMain.js';
import NavbarComponent from '../components/Navbar.js';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';
import ticketSearchImg from '../graphics/ticket-search.jpg';
import flightTrackerImg from '../graphics/flight-tracker.jpg';
import predictionImg from '../graphics/prediction.jpg';
import weatherImg from '../graphics/weather.jpg';

function MainPage({ isLoggedIn, userEmail, userType, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    navigate(path);
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
    <div>
      {isLoggedIn ? (
        <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <NavbarMainComponent isLoggedIn={isLoggedIn} userEmail={userEmail} />
      )}
      <Container fluid className="main-page">
        <Row className="mt-4">
          <Col md={6} className="mb-4">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-ticket-search">
                  Search for all available tickets through various third-party flight booking sites.
                </Tooltip>
              }
            >
              <Button
                variant="secondary"
                block
                className="module-btn"
                onClick={() => handleProtectedClick('/ticket-search')}
                style={{ backgroundImage: `url(${ticketSearchImg})` }}
              >
                <span>Ticket Search</span>
              </Button>
            </OverlayTrigger>
          </Col>
          <Col md={6} className="mb-4">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-flight-tracker">
                  Track real-time flight information such as flight status and departure time.
                </Tooltip>
              }
            >
              <Button
                variant="secondary"
                block
                className="module-btn"
                onClick={() => handleProtectedClick('/flight-tracker')}
                style={{ backgroundImage: `url(${flightTrackerImg})` }}
              >
                <span>Flight Tracker</span>
              </Button>
            </OverlayTrigger>
          </Col>
          <Col md={6} className="mb-4">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-prediction">
                  Get flight delay and ticket price prediction information, powered by machine learning.
                </Tooltip>
              }
            >
              <Button
                variant="secondary"
                block
                className="module-btn"
                onClick={handlePredictionClick}
                style={{ backgroundImage: `url(${predictionImg})` }}
              >
                <span>Prediction</span>
              </Button>
            </OverlayTrigger>
          </Col>
          <Col md={6} className="mb-4">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-weather">
                  Check the weather at your destination city while planning your trip.
                </Tooltip>
              }
            >
              <Button
                variant="secondary"
                block
                className="module-btn"
                onClick={() => handleProtectedClick('/weather-forecast')}
                style={{ backgroundImage: `url(${weatherImg})` }}
              >
                <span>Weather Forecast</span>
              </Button>
            </OverlayTrigger>
          </Col>
        </Row>
      </Container>
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default MainPage;