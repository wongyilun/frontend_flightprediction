import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FlightTracker.css';
import NavbarComponent from '../components/Navbar';
import TrackerFavoriteButton from '../components/TrackerFavoriteButton';
import TrackerBookingButton from '../components/BookingButton'; 
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';

function FlightTracker({ isLoggedIn, userEmail, userType, setIsLoggedIn }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validDates, setValidDates] = useState([]);
  const navigate = useNavigate();

  // Helper function to format date in yyyy-mm-dd format
  const formatDate = (date) => date.toISOString().split('T')[0];

  // Set valid dates range
  useEffect(() => {
    const today = new Date();
    const dayBeforeBefore = new Date(today);
    dayBeforeBefore.setDate(today.getDate() - 3);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    setValidDates([
      formatDate(dayBeforeBefore),
      formatDate(dayBeforeYesterday),
      formatDate(yesterday),
      formatDate(today),
      formatDate(tomorrow),
    ]);
    
    setStartDate(formatDate(today)); 
  }, []);

  const handleSearch = async () => {
    if (!flightNumber || !startDate) {
      alert("Please enter a flight number and start date");
      return;
    }

    const url = `http://localhost:8080/flights/${flightNumber}?startDate=${startDate}`;
    try {
      setLoading(true);
      const response = await axios.get(url);
      setFlightData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePredictionRedirect = () => {
    if (!flightData) {
      alert("No flight data available");
      return;
    }

    const {
      ident_iata,
      origin,
      destination,
      scheduled_out_date,
      scheduled_out_time,
      scheduled_in_date,
      scheduled_in_time,
      aircraft_type,
      gate_origin
    } = flightData;

    if (!ident_iata || !origin || !destination) {
      alert("Incomplete flight data");
      return;
    }

    navigate('/prediction', { state: {
      flightNumber: ident_iata,
      departureAirport: origin.code_iata,
      arrivalAirport: destination.code_iata,
      scheduledDeparture: `${scheduled_out_date} ${scheduled_out_time}`,
      scheduledArrival: `${scheduled_in_date} ${scheduled_in_time}`,
      aircraftType: aircraft_type || '',
      gateOrigin: gate_origin || ''
    }});
  };

  const handleBookingRedirect = () => {
    if (!flightData) {
      alert("No flight data available");
      return;
    }

    const {
      origin,
      destination,
      scheduled_out_date,
      scheduled_in_date
    } = flightData;

    if (!origin || !destination || !scheduled_out_date) {
      alert("Incomplete flight data");
      return;
    }

    // Format the dates as yymmdd
    const formatDate = (date) => date.replace(/-/g, '').slice(2);

    const departureDate = formatDate(scheduled_out_date);
    const arrivalDate = formatDate(scheduled_in_date);

    const url = `https://www.skyscanner.com.sg/transport/flights/${origin.code_iata}/${destination.code_iata}/${departureDate}/${arrivalDate}`;
    window.location.href = url;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (validDates.includes(selectedDate)) {
      setStartDate(selectedDate);
    } else {
      alert("Selected date is out of range. Please select a valid date.");
    }
  };

  return (
    <div>
      <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      <div className="flight-tracker">
        <h2>Flight Tracker</h2>
        <div className="input-group">
          <label htmlFor="flightNumber">Flight Number</label>
          <input
            id="flightNumber"
            type="text"
            placeholder="E.g. MU544"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="startDate">Flight Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            min={validDates[0]}
            max={validDates[validDates.length - 1]}
            onChange={handleDateChange}
          />
        </div>
        <button onClick={handleSearch}>Search</button>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {flightData && (
          <div className="flight-info">
            <TrackerFavoriteButton flightData={flightData} />
            <p><strong>Flight Number:</strong> {flightData.ident_iata}</p>
            <p><strong>Status:</strong> {flightData.status}</p>
            <p><strong>Departure Airport:</strong> {flightData.origin.name} ({flightData.origin.code_iata}), {flightData.origin.city}</p>
            <p><strong>Arrival Airport:</strong> {flightData.destination.name} ({flightData.destination.code_iata}), {flightData.destination.city}</p>
            <p><strong>Scheduled Departure:</strong> {flightData.scheduled_out_date} {flightData.scheduled_out_time}</p>
            <p><strong>Estimated Departure:</strong> {flightData.estimated_out_date} {flightData.estimated_out_time}</p>
            <p><strong>Actual Departure:</strong> {flightData.actual_out_date} {flightData.actual_out_time}</p>
            <p><strong>Scheduled Arrival:</strong> {flightData.scheduled_in_date} {flightData.scheduled_in_time}</p>
            <p><strong>Estimated Arrival:</strong> {flightData.estimated_in_date} {flightData.estimated_in_time}</p>
            <p><strong>Actual Arrival:</strong> {flightData.actual_in_date} {flightData.actual_in_time}</p>
            <p><strong>Aircraft Type:</strong> {flightData.aircraft_type}</p>
            <p><strong>Terminal Origin:</strong> {flightData.terminal_origin}</p>
            <p><strong>Gate Origin:</strong> {flightData.gate_origin}</p>
            <p><strong>Terminal Destination:</strong> {flightData.terminal_destination}</p>
            <p><strong>Baggage Claim:</strong> {flightData.baggage_claim}</p>
            <div className="buttons-row">
              <button onClick={handlePredictionRedirect} className="tracker-button">
                Go to Prediction
              </button>
              <button onClick={handleBookingRedirect} className="tracker-button">
                Book Ticket
              </button>
            </div>
          </div>
        )}
      </div>
      <br />
      <br />
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default FlightTracker;
