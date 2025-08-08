// src/components/OptionsWidget.js
import React from 'react';
import { Link } from 'react-router-dom';

const OptionsWidget = (props) => {
  const options = [
    { text: "About Predict2fly", link: "/About"},
    { text: "Search Flight Tickets", link: "/ticket-search"},
    { text: "Track Flight", link: "/flight-tracker" },
    // { text: "Get Flight Prediction", link: "/prediction"},
    { text: "Check Weather Forecast", link: "/weather-forecast"},
    { text: "Membership Policy", link: "/membership"},
  ];

  return (
    <div>
      {options.map((option, index) => (
        <div key={index} className="option-container">
          <Link to={option.link} className="chatbot-option-link">
            <strong>{option.text}</strong>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default OptionsWidget;
