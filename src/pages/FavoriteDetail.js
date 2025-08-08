import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';
import './FavoriteDetail.css'; 

function DetailsPage({ isLoggedIn, userEmail, setIsLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state;

  const handleBackToFavorites = () => {
    navigate('/favorites');
  };

  return (
    <div className="details-page">
      <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      <div className="details-content">
        <h2>Details of the Selected Item</h2>
        {item.ident_iata ? (
          <>
            <p><strong>Flight Number:</strong> {item.ident_iata}</p>
            <p><strong>Departure Date:</strong> {item.scheduled_out_date}</p>
            <p><strong>Arrival Date:</strong> {item.scheduled_in_date}</p>
            <p><strong>Departure Airport:</strong> {item.origin.name} ({item.origin.code_iata})</p>
            <p><strong>Arrival Airport:</strong> {item.destination.name} ({item.destination.code_iata})</p>
            <p><strong>Aircraft Type:</strong> {item.aircraft_type}</p>
            <p><strong>Status:</strong> {item.status}</p>
          </>
        ) : item.iataCodeFlight ? (
          <>
            <p><strong>Flight Number:</strong> {item.iataCodeFlight}</p>
            <p><strong>Departure Date:</strong> {item.departureDate}</p>
            <p><strong>Arrival Date:</strong> {item.arrivalDate}</p>
            <p><strong>Departure Airport:</strong> {item.departureIataCode}</p>
            <p><strong>Arrival Airport:</strong> {item.arrivalIataCode}</p>
            <p><strong>Cabin:</strong> {item.cabin}</p>
          </>
        ) : item.iataCodeFlight_1 ? (
          <>
            <h3>First Leg</h3>
            <p><strong>Flight Number:</strong> {item.iataCodeFlight_1}</p>
            <p><strong>Departure Date:</strong> {item.departureDate_1}</p>
            <p><strong>Arrival Date:</strong> {item.arrivalDate_1}</p>
            <p><strong>Departure Airport:</strong> {item.locationIataCode_1}</p>
            <p><strong>Arrival Airport:</strong> {item.locationIataCode_2}</p>
            <h3>Second Leg</h3>
            <p><strong>Flight Number:</strong> {item.iataCodeFlight_2}</p>
            <p><strong>Departure Date:</strong> {item.departureDate_2}</p>
            <p><strong>Arrival Date:</strong> {item.arrivalDate_2}</p>
          </>
        ) : (
          <p>No details available for this item.</p>
        )}
        <button className="back-button" onClick={handleBackToFavorites}>Back to Favorites</button>
      </div>
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default DetailsPage;