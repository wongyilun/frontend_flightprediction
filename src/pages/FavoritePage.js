import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FavoritePage.css';
import NavbarComponent from '../components/Navbar';
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function FavoritePage({ isLoggedIn, userEmail, setIsLoggedIn }) {
  const [favoriteFlights, setFavoriteFlights] = useState([]);
  const [favoriteOnewayTickets, setFavoriteOnewayTickets] = useState([]);
  const [favoriteReturnTickets, setFavoriteReturnTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const flightResponse = await axios.get('http://localhost:8080/favourites/viewFlight', {
          withCredentials: true,
        });
        const onewayResponse = await axios.get('http://localhost:8080/favourites/viewTicketOneway', {
          withCredentials: true,
        });
        const returnResponse = await axios.get('http://localhost:8080/favourites/viewTicketReturn', {
          withCredentials: true,
        });
        setFavoriteFlights(flightResponse.data);
        setFavoriteOnewayTickets(onewayResponse.data);
        setFavoriteReturnTickets(returnResponse.data);
      } catch (error) {
        console.error('Error fetching favorite items:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      }
    };

    fetchFavorites();
  }, []);

  const handleDeleteFlight = async (flightId) => {
    try {
      await axios.delete(`http://localhost:8080/favourites/deleteFlight/${flightId}`, {
        withCredentials: true,
      });
      setFavoriteFlights(favoriteFlights.filter(flight => flight.id !== flightId));
      alert('Flight removed from favorites');
    } catch (error) {
      console.error('Error deleting flight:', error);
      alert('Failed to delete flight from favorites.');
    }
  };

  const handleDeleteOneway = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:8080/favourites/deleteTicketOneway/${ticketId}`, {
        withCredentials: true,
      });
      setFavoriteOnewayTickets(favoriteOnewayTickets.filter(ticket => ticket.id !== ticketId));
      alert('One-way ticket removed from favorites');
    } catch (error) {
      console.error('Error deleting one-way ticket:', error);
      alert('Failed to delete one-way ticket from favorites.');
    }
  };

  const handleDeleteReturn = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:8080/favourites/deleteTicketReturn/${ticketId}`, {
        withCredentials: true,
      });
      setFavoriteReturnTickets(favoriteReturnTickets.filter(ticket => ticket.id !== ticketId));
      alert('Return ticket removed from favorites');
    } catch (error) {
      console.error('Error deleting return ticket:', error);
      alert('Failed to delete return ticket from favorites.');
    }
  };

  // const handleBellClick = (item) => {
  //   navigate('/notifications', { state: { item } });
  // };

  const handleBellClick = (item) => {
    const { ident_iata, scheduled_out_date, iataCodeFlight, departureDate } = item;
    const flightNumber = ident_iata || iataCodeFlight;
    const date = scheduled_out_date || departureDate;
  
    navigate('/notifications', {
      state: {
        flightNumber: flightNumber,
        departureDate: date,
      },
    });
  };

  const handlePredictionClick = (item) => {
    navigate('/prediction', { state: item });
  };

  const handleDetailsClick = (item) => {
    navigate('/favoritedetail', { state: item }); 
  };

  return (
    <div className="favorite-page">
      <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      <div className="favorite-info">
        <h2>Your Favorite Items</h2>

        {favoriteFlights.length > 0 && (
          <>
            <h3>Flights</h3>
            <ul className="favorite-list">
              {favoriteFlights.map(flight => (
                <li key={flight.id} className="favorite-item">
                  <div className="item-details">
                    <p><strong>Flight Number:</strong> {flight.ident_iata}</p>
                    <p><strong>Departure Date:</strong> {flight.scheduled_out_date}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleDetailsClick(flight)} className="details-button">
                      Details
                    </button>
                    <button onClick={() => handlePredictionClick(flight)} className="prediction-button">
                      Prediction
                    </button>
                    <button onClick={() => handleBellClick(flight)} className="bell-button">
                      <FontAwesomeIcon icon={faBell} />
                    </button>
                    <button onClick={() => handleDeleteFlight(flight.id)} className="delete-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {favoriteOnewayTickets.length > 0 && (
          <>
            <h3>One-way Tickets</h3>
            <ul className="favorite-list">
              {favoriteOnewayTickets.map(ticket => (
                <li key={ticket.id} className="favorite-item">
                  <div className="item-details">
                    <p><strong>Flight Number:</strong> {ticket.iataCodeFlight}</p>
                    <p><strong>Departure Date:</strong> {ticket.departureDate}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleDetailsClick(ticket)} className="details-button">
                      Details
                    </button>
                    <button onClick={() => handlePredictionClick(ticket)} className="prediction-button">
                      Prediction
                    </button>
                    <button onClick={() => handleBellClick(ticket)} className="bell-button">
                      <FontAwesomeIcon icon={faBell} />
                    </button>
                    <button onClick={() => handleDeleteOneway(ticket.id)} className="delete-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {favoriteReturnTickets.length > 0 && (
          <>
            <h3>Return Tickets</h3>
            <ul className="favorite-list">
              {favoriteReturnTickets.map(ticket => (
                <li key={ticket.id} className="favorite-item">
                  <div className="item-details">
                    <p><strong>Flight Number 1:</strong> {ticket.iataCodeFlight_1}</p>
                    <p><strong>Departure Date 1:</strong> {ticket.departureDate_1}</p>
                    <p><strong>Flight Number 2:</strong> {ticket.iataCodeFlight_2}</p>
                    <p><strong>Departure Date 2:</strong> {ticket.departureDate_2}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleDetailsClick(ticket)} className="details-button">
                      Details
                    </button>
                    <button onClick={() => handlePredictionClick(ticket)} className="prediction-button">
                      Prediction
                    </button>
                    <button onClick={() => handleBellClick(ticket)} className="bell-button">
                      <FontAwesomeIcon icon={faBell} />
                    </button>
                    <button onClick={() => handleDeleteReturn(ticket.id)} className="delete-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {favoriteFlights.length === 0 && favoriteOnewayTickets.length === 0 && favoriteReturnTickets.length === 0 && (
          <p>You have no favorite items.</p>
        )}
      </div>
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default FavoritePage;