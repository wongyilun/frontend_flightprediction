import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import { loadAirportsData, formatDataForAutosuggest } from './airportsData';
import './TicketSearch.css';
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';
import TicketFavoriteButton from '../components/TicketFavoriteButton';
import TicketPredictionButton from '../components/TicketPredictionButton';
import BookingButton from '../components/BookingButton';
import { useNavigate } from 'react-router-dom';
import NavbarMainComponent from '../components/NavbarMain';
import NavbarComponent from '../components/Navbar';

// Helper method to format date time
const formatDateTime = (date, time) => {
  if (!date || !time) return 'N/A';
  const [year, month, day] = date.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const [hours, minutes] = time.slice(0, 5).split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;

  const formattedTime = `${adjustedHours}:${minutes < 10 ? `0${minutes}` : minutes}${period}`;

  return `${formattedDate} ${formattedTime}`;
};

// Helper method to calculate duration
const calculateDuration = (departureDate, departureTime, arrivalDate, arrivalTime) => {
  if (!departureDate || !departureTime || !arrivalDate || !arrivalTime) return 'N/A';
  const departure = new Date(`${departureDate}T${departureTime}`);
  const arrival = new Date(`${arrivalDate}T${arrivalTime}`);
  const duration = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' }).format(new Date(arrival - departure));
  return duration;
};

// Helper method to get today's date and date six months from today
const getDateRange = () => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 6);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    minDate: formatDate(today),
    maxDate: formatDate(maxDate),
  };
};

function TicketSearch({ isLoggedIn, userEmail, setIsLoggedIn }) {
  const [flights, setFlights] = useState([]);
  const [departure, setDeparture] = useState('SIN');
  const [destination, setDestination] = useState('NRT');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelClass, setTravelClass] = useState('ECONOMY');
  const [maxPrice, setMaxPrice] = useState('10000');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [airports, setAirports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // Get date range for date inputs
  const { minDate, maxDate } = getDateRange();

  const handleGoToPrediction = (flight) => {
    navigate('/prediction', {
      state: {
        flightNumber: `${flight.itineraries[0]?.carrierCode}${flight.itineraries[0]?.flightNumber}`,
        departureAirport: flight.itineraries[0]?.departure?.cityCode,
        arrivalAirport: flight.itineraries[0]?.arrival?.cityCode,
        scheduledDeparture: `${flight.itineraries[0]?.departure?.date}T${flight.itineraries[0]?.departure?.time}`,
        scheduledArrival: `${flight.itineraries[0]?.arrival?.date}T${flight.itineraries[0]?.arrival?.time}`,
        ticketPrice: flight.grandTotalPrice,
      }
    });
  };

  useEffect(() => {
    loadAirportsData().then(data => {
      setAirports(formatDataForAutosuggest(data));
    }).catch(error => {
      console.error('Error loading airports data:', error);
    });
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const url = isRoundTrip
        ? 'http://localhost:8080/flight-ticket/return'
        : 'http://localhost:8080/flight-ticket/oneway';
      const params = isRoundTrip
        ? {
            origin: departure,
            destination: destination,
            departureDate: departureDate,
            returnDate: returnDate,
            travelClass: travelClass,
            maxPrice: maxPrice
          }
        : {
            origin: departure,
            destination: destination,
            departureDate: departureDate,
            travelClass: travelClass,
            maxPrice: maxPrice
          };
      const response = await axios.get(url, { params });
      setFlights(response.data || []);
    } catch (error) {
      console.error('Error fetching flight data', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleBookingRedirect = () => {
    if (!flights || flights.length === 0) {
      alert("No flight data available");
      return;
    }
  
    const flight = flights[0];
  
    const origin = flight.itineraries[0]?.departure?.cityCode;
    const destination = flight.itineraries[0]?.arrival?.cityCode;
  
    if (!origin || !destination) {
      alert("Incomplete flight data");
      return;
    }
  
    // Format the dates as yymmdd
    const formatDate = (date) => date.replace(/-/g, '').slice(2);
  
    const departureDate = formatDate(flight.itineraries[0]?.departure?.date);
    const arrivalDate = formatDate(flight.itineraries[0]?.arrival?.date);
  
    const url = `https://www.skyscanner.com.sg/transport/flights/${origin}/${destination}/${departureDate}/${arrivalDate}`;
    window.location.href = url;
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    return airports.filter(airport => {
      const label = airport.label ? airport.label.toLowerCase() : '';
      const city = airport.city ? airport.city.toLowerCase() : '';
      const country = airport.country ? airport.country.toLowerCase() : '';

      return label.includes(inputValue) ||
             city.includes(inputValue) ||
             country.includes(inputValue);
    });
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (e, { suggestion }, field) => {
    if (field === 'departure') {
      setDeparture(suggestion.value);
    } else if (field === 'destination') {
      setDestination(suggestion.value);
    }
  };

  const inputPropsDeparture = {
    placeholder: 'Airport, City, or Country',
    value: departure,
    onChange: (e, { newValue }) => setDeparture(newValue),
  };

  const inputPropsDestination = {
    placeholder: 'Airport, City, or Country',
    value: destination,
    onChange: (e, { newValue }) => setDestination(newValue),
  };

  useEffect(() => {
    const today = new Date();
    setDepartureDate(today.toISOString().split('T')[0]);
  }, []);

  return (
    <div className="ticket-search-page">
      {/* {isLoggedIn ? <NavbarMainComponent isLoggedIn={isLoggedIn} /> : <NavbarComponent />} */}
      <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      <div className="search-bar">
        <h2>Ticket Search</h2>
        <div className="input-group">
          <label htmlFor="departure">Departure Airport:</label>
          <Autosuggest
            id="departure"
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.label}
            renderSuggestion={(suggestion) => <div>{suggestion.label}</div>}
            inputProps={inputPropsDeparture}
            onSuggestionSelected={(e, { suggestion }) => onSuggestionSelected(e, { suggestion }, 'departure')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="destination">Destination Airport:</label>
          <Autosuggest
            id="destination"
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.label}
            renderSuggestion={(suggestion) => <div>{suggestion.label}</div>}
            inputProps={inputPropsDestination}
            onSuggestionSelected={(e, { suggestion }) => onSuggestionSelected(e, { suggestion }, 'destination')}
          />
        </div>
        <div className="input-group">
          <label htmlFor="departureDate">Departure Date:</label>
          <input
            id="departureDate"
            type="date"
            value={departureDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>
        {isRoundTrip && (
          <div className="input-group">
            <label htmlFor="returnDate">Return Date:</label>
            <input
              id="returnDate"
              type="date"
              value={returnDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="travelClass">Travel Class:</label>
          <select
            id="travelClass"
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
          >
            <option value="ECONOMY">Economy</option>
            <option value="PREMIUM_ECONOMY">Premium Economy</option>
            <option value="BUSINESS">Business</option>
            <option value="FIRST">First</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="maxPrice">Max Price:</label>
          <input
            id="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="isRoundTrip">
            Round Trip
            <input
              id="isRoundTrip"
              type="checkbox"
              checked={isRoundTrip}
              onChange={(e) => setIsRoundTrip(e.target.checked)}
            />
          </label>
        </div>
        <button onClick={fetchFlights} className="search-button">🔍 Search</button>
        {loading && <p className="loading-text">Loading...</p>}
      </div>
      <div className="flights-list">
        {flights.length > 0 ? (
          flights.map((flight, index) => (
            <div className="flight" key={index}>
              <TicketFavoriteButton flightData={flight} isRoundTrip={isRoundTrip} />
              <h3>Flight {flight.itineraries[0]?.carrierCode + flight.itineraries[0]?.flightNumber || 'N/A'}</h3>
              <p>Airline: {flight.airlineCode?.join(', ') || 'N/A'}</p>
              <p>From: {flight.itineraries[0]?.departure?.cityCode || 'N/A'}</p>
              <p>To: {flight.itineraries[0]?.arrival?.cityCode || 'N/A'}</p>
              <p>Scheduled Departure: {formatDateTime(
                flight.itineraries[0]?.departure?.date, 
                flight.itineraries[0]?.departure?.time
              ) || 'N/A'}</p>
              <p>Scheduled Arrival: {formatDateTime(
                flight.itineraries[0]?.arrival?.date, 
                flight.itineraries[0]?.arrival?.time
              ) || 'N/A'}</p>
              <p>Price: {flight.grandTotalPrice || 'N/A'} SGD</p>
              <p>Cabin: {flight.fareDetailsBySegment[0]?.cabin || 'N/A'}</p>
              <p>Included Checked Bags: {flight.fareDetailsBySegment[0]?.includedCheckedBagsQuantity || 'N/A'}</p>
              <p>Duration: {calculateDuration(
                flight.itineraries[0]?.departure?.date, 
                flight.itineraries[0]?.departure?.time, 
                flight.itineraries[0]?.arrival?.date, 
                flight.itineraries[0]?.arrival?.time
              ) || 'N/A'}</p>
              {/* <button onClick={() => handleGoToPrediction(flight)} style={{borderRadius: '5px'}}>Go To Prediction</button>
              <button onClick={handleBookingRedirect} className="tracker-button">
                Book Ticket
              </button> */}
              <button 
                onClick={() => handleGoToPrediction(flight)} 
                className="common-button"
              >
                Go To Prediction
              </button>
              <button 
                onClick={handleBookingRedirect} 
                className="common-button"
              >
                Book Ticket
              </button>
            </div>
          ))
        ) : (
          !loading && <p>No flights available</p>
        )}
      </div>
      <br /><br /><br />
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default TicketSearch;
