import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { loadAirportsData, formatDataForAutosuggest } from './airportsData';
import './Prediction.css';
import NavbarComponent from '../components/Navbar';
import FooterComponent from '../components/Footer';
import ChatbotComponent from '../components/Chatbot/Chatbot.js';
import axios from 'axios';
import Chart from 'chart.js/auto';
import config from '../config';

function Prediction({ isLoggedIn, userEmail, userType, setIsLoggedIn }) {
  const location = useLocation();
  const { state } = location;

  const [formData, setFormData] = useState({
    flightNumber: state?.flightNumber || 'MU544',
    departureAirport: state?.departureAirport || 'SIN',
    arrivalAirport: state?.arrivalAirport || 'LHR',
    scheduledDeparture: state?.scheduledDeparture || '',
    scheduledArrival: state?.scheduledArrival || '',
    aircraftType: state?.aircraftType || 'A332',
    gateOrigin: state?.gateOrigin || '',
    weather: '',
    ticketPrice: state?.ticketPrice || ''
  });

  const [airports, setAirports] = useState([]);
  const [suggestionsDeparture, setSuggestionsDeparture] = useState([]);
  const [suggestionsArrival, setSuggestionsArrival] = useState([]);
  const [output, setOutput] = useState(null); 
  const [priceData, setPriceData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    loadAirportsData().then(data => {
      setAirports(formatDataForAutosuggest(data));
    }).catch(error => {
      console.error('Error loading airports data:', error);
    });
  }, []);

  useEffect(() => {
    let myChart = null;

    if (priceData.length > 0 && chartRef.current) {
      myChart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: priceData.map(item => item[0]), 
          datasets: [
            {
              label: 'Ticket Price',
              data: priceData.map(item => item[1]), 
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Price: $${context.raw}`;
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price'
              },
              beginAtZero: true
            }
          }
        }
      });
    }

    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [priceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelayPrediction = async () => {
    if (
      !formData.flightNumber ||
      !formData.departureAirport ||
      !formData.arrivalAirport ||
      !formData.scheduledDeparture ||
      !formData.scheduledArrival ||
      !formData.aircraftType
    ) {
      alert("All fields are required: Flight Number, Departure Airport, Arrival Airport, Scheduled Departure, Scheduled Arrival, and Aircraft Type.");
      return;
    }
  try {
    const predictionData = {
      flightNumber: formData.flightNumber,
      departureAirport: formData.departureAirport,
      arrivalAirport: formData.arrivalAirport,
      scheduledDeparture: formData.scheduledDeparture,
      scheduledArrival: formData.scheduledArrival,
      aircraftType: formData.aircraftType,
      TMAX: 30, 
      TMIN: 22,
      PRCP: 12
    };

    const response = await axios.post(`${config.serverFlask}/flightprediction`, predictionData);
    setOutput({
      type: 'delay',
      data: {
        arrivalDelay: response.data.ArrDelayPredict[0],
        departureDelay: response.data.DepDelayPrediction[0],
        reason: response.data.ReasonPrediction[0]
      }
    });
  } catch (error) {
    console.error('Error predicting flight delay:', error);
    setOutput({
      type: 'delay',
      data: {
        error: 'Failed to predict flight delay.'
      }
    });
  }
};

  const handleTicketPrediction = async () => {
    if (!formData.flightNumber || !formData.scheduledDeparture || !formData.ticketPrice) {
      alert("Flight number, scheduled departure, and current ticket price are required.");
      return;
    }

    try {
      const predictionData = {
        flightNumber: formData.flightNumber,
        departureAirport: formData.departureAirport,
        arrivalAirport: formData.arrivalAirport,
        scheduledDeparture: formData.scheduledDeparture,
        scheduledArrival: formData.scheduledArrival,
        currentDate: new Date().toISOString().split('T')[0],
        aircraftType: formData.aircraftType,
        ticketPrice: parseFloat(formData.ticketPrice)
      };

      const response = await axios.post(`${config.serverFlask}/ticketpriceprediction`, predictionData);
      const prices = response.data.prices;

      setPriceData(prices);
      setOutput({
        type: 'price',
        data: prices
      });
    } catch (error) {
      console.error('Error predicting ticket price:', error);
      setOutput({
        type: 'price',
        data: {
          error: 'Failed to predict ticket price.'
        }
      });
    }
  };

  const getSuggestions = (value, airports) => {
    const inputValue = value.trim().toLowerCase();
    return airports.filter(airport => {
      const label = airport.label ? airport.label.toLowerCase() : '';
      const city = airport.city ? airport.city.toLowerCase() : '';
      const country = airport.country ? airport.country.toLowerCase() : '';
      return label.includes(inputValue) || city.includes(inputValue) || country.includes(inputValue);
    });
  };

  const onSuggestionsFetchRequestedDeparture = ({ value }) => {
    setSuggestionsDeparture(getSuggestions(value, airports));
  };

  const onSuggestionsClearRequestedDeparture = () => {
    setSuggestionsDeparture([]);
  };

  const onSuggestionSelectedDeparture = (e, { suggestion }) => {
    setFormData(prev => ({
      ...prev,
      departureAirport: suggestion.label
    }));
  };

  const onSuggestionsFetchRequestedArrival = ({ value }) => {
    setSuggestionsArrival(getSuggestions(value, airports));
  };

  const onSuggestionsClearRequestedArrival = () => {
    setSuggestionsArrival([]);
  };

  const onSuggestionSelectedArrival = (e, { suggestion }) => {
    setFormData(prev => ({
      ...prev,
      arrivalAirport: suggestion.label
    }));
  };

  const inputPropsDeparture = {
    placeholder: 'Airport, City, or Country',
    value: formData.departureAirport,
    onChange: (e, { newValue }) => setFormData(prev => ({ ...prev, departureAirport: newValue })),
  };

  const inputPropsArrival = {
    placeholder: 'Airport, City, or Country',
    value: formData.arrivalAirport,
    onChange: (e, { newValue }) => setFormData(prev => ({ ...prev, arrivalAirport: newValue })),
  };

  return (
    <div>
      <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
      <div className="prediction-container">
        <div className="prediction-form">
          <h2>Flight Prediction</h2>
          <div className="input-group">
            <label htmlFor="flightNumber">Flight Number</label>
            <input
              id="flightNumber"
              type="text"
              name="flightNumber"
              placeholder="E.g. MU544"
              value={formData.flightNumber}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="departureAirport">Departure Airport</label>
            <Autosuggest
              suggestions={suggestionsDeparture}
              onSuggestionsFetchRequested={onSuggestionsFetchRequestedDeparture}
              onSuggestionsClearRequested={onSuggestionsClearRequestedDeparture}
              getSuggestionValue={(suggestion) => suggestion.label}
              renderSuggestion={(suggestion) => <div>{suggestion.label}</div>}
              inputProps={inputPropsDeparture}
              onSuggestionSelected={onSuggestionSelectedDeparture}
            />
          </div>
          <div className="input-group">
            <label htmlFor="arrivalAirport">Arrival Airport</label>
            <Autosuggest
              suggestions={suggestionsArrival}
              onSuggestionsFetchRequested={onSuggestionsFetchRequestedArrival}
              onSuggestionsClearRequested={onSuggestionsClearRequestedArrival}
              getSuggestionValue={(suggestion) => suggestion.label}
              renderSuggestion={(suggestion) => <div>{suggestion.label}</div>}
              inputProps={inputPropsArrival}
              onSuggestionSelected={onSuggestionSelectedArrival}
            />
          </div>
          <div className="input-group">
            <label htmlFor="scheduledDeparture">Scheduled Departure</label>
            <input
              id="scheduledDeparture"
              type="datetime-local"
              name="scheduledDeparture"
              value={formData.scheduledDeparture}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="scheduledArrival">Scheduled Arrival</label>
            <input
              id="scheduledArrival"
              type="datetime-local"
              name="scheduledArrival"
              value={formData.scheduledArrival}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="aircraftType">Aircraft Type</label>
            <input
              id="aircraftType"
              type="text"
              name="aircraftType"
              placeholder="E.g. A332"
              value={formData.aircraftType}
              readOnly
            />
          </div>
          <div className="input-group">
            <label htmlFor="gateOrigin">Gate Origin</label>
            <input
              id="gateOrigin"
              type="text"
              name="gateOrigin"
              value={formData.gateOrigin}
              readOnly
            />
          </div>
          <div className="input-group">
            <label htmlFor="ticketPrice">Current Ticket Price</label>
            <input
              id="ticketPrice"
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
            />
          </div>
          <div className="buttons-row">
            <button onClick={handleDelayPrediction}>Predict Delay</button>
            <button onClick={handleTicketPrediction}>Predict Ticket Price</button>
          </div>
  
          {output && output.type === 'delay' && (
            <div className="output delay-output">
              <h3>Delay Prediction Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>Arrival Delay</th>
                    <th>Departure Delay</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{output.data.arrivalDelay}</td>
                    <td>{output.data.departureDelay}</td>
                    <td>{output.data.reason}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
  
          {output && output.type === 'price' && (
            <div className="output price-output">
              <h3>Ticket Price Prediction</h3>
              <div className="chart-container">
                <canvas ref={chartRef} />
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatbotComponent />
    </div>
  );
}

export default Prediction;