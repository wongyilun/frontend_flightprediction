import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TrackerPredictionButton.css';

const TrackerPredictionButton = ({ flightData }) => {
  const navigate = useNavigate();

  const handlePredictionRedirect = () => {
    navigate('/prediction', { state: {
      flightNumber: flightData.ident_iata,
      departureAirport: flightData.origin.name,
      arrivalAirport: flightData.destination.name,
      scheduledDeparture: `${flightData.scheduled_out_date} ${flightData.scheduled_out_time}`,
      scheduledArrival: `${flightData.scheduled_in_date} ${flightData.scheduled_in_time}`
    }});
  };

  return (
    <button className="tracker-prediction-button" onClick={handlePredictionRedirect}>
      Go to Prediction
    </button>
  );
};

export default TrackerPredictionButton;