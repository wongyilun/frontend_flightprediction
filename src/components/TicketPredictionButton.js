import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TicketPredictionButton.css';

const TicketPredictionButton = ({ flightData }) => {
  const navigate = useNavigate();

  const handlePredictionRedirect = () => {
    navigate('/prediction', { state: {
      flightNumber: flightData.itineraries[0].flightNumber,
      departureAirport: flightData.itineraries[0].departure.iataCode,
      arrivalAirport: flightData.itineraries[0].arrival.iataCode,
      scheduledDeparture: `${flightData.itineraries[0].departure.date} ${flightData.itineraries[0].departure.time}`,
      scheduledArrival: `${flightData.itineraries[0].arrival.date} ${flightData.itineraries[0].arrival.time}`
    }});
  };

  return (
    <button className="ticket-prediction-button" onClick={handlePredictionRedirect}>
      Go to Prediction
    </button>
  );
};

export default TicketPredictionButton;