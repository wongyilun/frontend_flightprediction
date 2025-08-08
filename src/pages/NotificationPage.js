import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import NavbarComponent from '../components/Navbar';
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { loadAirportsData, formatDataForAutosuggest } from './airportsData';
import './NotificationPage.css';
import { useLocation } from 'react-router-dom';

function NotificationPage({ isLoggedIn, userEmail, setIsLoggedIn }) {
  const [notifications, setNotifications] = useState([]);
  const [notificationTime, setNotificationTime] = useState('');
  const [notificationType, setNotificationType] = useState('departure');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [airports, setAirports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  // pass arguements
  const location = useLocation();
  const { flightNumber, departureDate } = location.state || {};

  const [iataCodeFlight, setIataCodeFlight] = useState(flightNumber || '');
  const [departureDateState, setDepartureDate] = useState(departureDate || '');
  
  

  useEffect(() => {
    loadAirportsData().then(data => {
      setAirports(formatDataForAutosuggest(data));
    }).catch(error => {
      console.error('Error loading airports data:', error);
    });
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/notifications/view', {
          withCredentials: true,
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      }
    };

    fetchNotifications();
  }, []);

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
    if (field === 'origin') {
      setOrigin(suggestion.value);
    } else if (field === 'destination') {
      setDestination(suggestion.value);
    }
  };

  const inputPropsOrigin = {
    placeholder: 'Airport, City, or Country',
    value: origin,
    onChange: (e, { newValue }) => setOrigin(newValue),
  };

  const inputPropsDestination = {
    placeholder: 'Airport, City, or Country',
    value: destination,
    onChange: (e, { newValue }) => setDestination(newValue),
  };

  const handleAddNotification = async () => {
    if (!notificationTime) {
      alert("Notification time is required");
      return;
    }

    const notificationData = {
      notificationDateTime: notificationTime,
      type: notificationType,
      iataCodeFlight: iataCodeFlight || undefined,
      originIataCode: origin || undefined,
      destinationIataCode: destination || undefined,
      departureDate: departureDate || undefined,
      departureTime: departureTime || undefined,
      arrivalDate: arrivalDate || undefined,
      arrivalTime: arrivalTime || undefined,
    };

    try {
      await axios.post('http://localhost:8080/notifications/add', notificationData, {
        withCredentials: true,
      });
      setNotifications([...notifications, notificationData]);
      alert('Notification added successfully!');
    } catch (error) {
      console.error('Error adding notification:', error);
      alert('Failed to add notification.');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/delete/${notificationId}`, {
        withCredentials: true,
      });
      setNotifications(notifications.filter(notification => notification.id !== notificationId));
      alert('Notification deleted successfully!');
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification.');
    }
  };

  return (
    <div className="notification-page">
      <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      <div className="notification-info">
        <h2>Set Notifications</h2>
        
        <div className="input-group">
          <label htmlFor="notificationTime">Notification Time:</label>
          <input
            id="notificationTime"
            type="datetime-local"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="iataCodeFlight">Flight Number:</label>
          <input
            id="iataCodeFlight"
            type="text"
            placeholder="e.g., HO1602"
            value={iataCodeFlight}
            onChange={(e) => setIataCodeFlight(e.target.value)}
          />
        </div>
  
        <div className="input-group">
          <label htmlFor="origin">Origin Airport:</label>
          <Autosuggest
            id="origin"
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.label}
            renderSuggestion={(suggestion) => <div>{suggestion.label}</div>}
            inputProps={inputPropsOrigin}
            onSuggestionSelected={(e, { suggestion }) => onSuggestionSelected(e, { suggestion }, 'origin')}
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
            value={departureDateState}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>
  
        <div className="input-group">
          <label htmlFor="departureTime">Departure Time:</label>
          <input
            id="departureTime"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </div>
  
        <div className="input-group">
          <label htmlFor="arrivalDate">Arrival Date:</label>
          <input
            id="arrivalDate"
            type="date"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
          />
        </div>
  
        <div className="input-group">
          <label htmlFor="arrivalTime">Arrival Time:</label>
          <input
            id="arrivalTime"
            type="time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />
        </div>
  
        <div className="input-group">
          <label htmlFor="notificationType">Notification Type:</label>
          <select
            id="notificationType"
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
          >
            <option value="departure">Departure</option>
            <option value="arrival">Arrival</option>
          </select>
        </div>
  
        <button onClick={handleAddNotification} className="add-button">
          Add Notification
        </button>
        
        <h3>Your Notifications</h3>
        
        {notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li key={notification.id} className="notification-item">
                <div className="item-details">
                  <p><strong>Flight:</strong> {notification.iataCodeFlight}</p>
                  <p><strong>Type:</strong> {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</p>
                  <p><strong>Notification Time:</strong> {notification.notificationDateTime}</p>
                </div>
                <button onClick={() => handleDeleteNotification(notification.id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications set.</p>
        )}
      </div>
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default NotificationPage;