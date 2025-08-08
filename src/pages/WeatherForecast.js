import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './WeatherForecast.css';
import NavbarComponent from '../components/Navbar';
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTemperatureHigh, faTint, faCloudShowersHeavy, faWind } from '@fortawesome/free-solid-svg-icons';

function WeatherForecast({ isLoggedIn, userEmail, userType, setIsLoggedIn }) {
  const [city, setCity] = useState('Singapore');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/population/cities');
        const cityList = response.data.data.map(cityDetails => ({
          label: `${cityDetails.city}, ${cityDetails.country}`,
          value: cityDetails.city
        }));
        setCities(cityList);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    // Set default start and end dates
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 4); // Set end date to 4 days from today

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  const fetchWeather = async () => {
    if (!city || !startDate || !endDate) {
      setError('Please provide all input values.');
      return;
    }

    const adjustDate = (dateStr) => {
      const date = new Date(dateStr);
      date.setDate(date.getDate() - 1);
      return date.toISOString().split('T')[0];
    };
    const adjustedStartDate = adjustDate(startDate);
    const adjustedEndDate = adjustDate(endDate);

    setLoading(true); // Set loading state to true before fetching data
    try {
      const apiKey = 'SS35ZHgo9nQO1oo9EWrlCD1M36ZZTUxT';
      const apiUrl = `https://api.tomorrow.io/v4/weather/forecast?location=${encodeURIComponent(city)}&apikey=${apiKey}`;
      
      const response = await axios.get(apiUrl);
      const dailyForecasts = response.data.timelines.daily;

      const filteredForecasts = dailyForecasts.filter(forecast => {
        const date = new Date(forecast.time).toISOString().split('T')[0];
        return date >= adjustedStartDate && date <= adjustedEndDate;
      });

      setWeatherData(filteredForecasts.slice(0, 5));
      setError('');
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData([]);
    } finally {
      setLoading(false); // Set loading state to false after fetching data
    }
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    return cities.filter(city => city.label.toLowerCase().includes(inputValue));
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (e, { suggestion }) => {
    setCity(suggestion.value);
  };

  const inputProps = {
    placeholder: 'City',
    value: city,
    onChange: (e, { newValue }) => setCity(newValue),
  };

  return (
    <div className="weather-forecast-page">
      <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      <div className="form-container">
        <h2>Weather Forecast</h2>
        <div className="form-field">
          <label htmlFor="city">Destination City</label>
          <Autosuggest
            id="city"
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.label}
            renderSuggestion={(suggestion) => <div>{suggestion.label}</div>}
            inputProps={inputProps}
            onSuggestionSelected={onSuggestionSelected}
          />
        </div>
        <div className="form-field">
          <label htmlFor="start-date">Travel Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="end-date">Travel End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="buttons-row">
          <button onClick={fetchWeather}>Get Weather</button>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="weather-results">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : weatherData.length > 0 ? (
          <table className="weather-table">
            <thead>
              <tr>
                <th><FontAwesomeIcon icon={faCalendar} /> Date</th>
                <th><FontAwesomeIcon icon={faTemperatureHigh} /> Temperature</th>
                <th><FontAwesomeIcon icon={faTint} /> Humidity</th>
                <th><FontAwesomeIcon icon={faCloudShowersHeavy} /> Rain Probability</th>
                <th><FontAwesomeIcon icon={faWind} /> Wind Speed</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((forecast, index) => {
                const date = new Date(forecast.time).toLocaleDateString();
                const precipitation = forecast.values.precipitationProbabilityAvg.toFixed(2) + '%';
                const temperature = forecast.values.temperatureAvg.toFixed(1) + '°C';
                const humidity = forecast.values.humidityAvg.toFixed(2) + '%';
                const wind = forecast.values.windSpeedAvg.toFixed(2) + ' m/s';

                return (
                  <tr key={index}>
                    <td>{date}</td>
                    <td>{temperature}</td>
                    <td>{humidity}</td>
                    <td>{precipitation}</td>
                    <td>{wind}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          !loading && <p>No weather data available</p> // Show message when no data is available
        )}
      </div>
      <br />
      <br />
      <br />
      <FooterComponent />
      <ChatbotComponent />
    </div>
  );
}

export default WeatherForecast;
