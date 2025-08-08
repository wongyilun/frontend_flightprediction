import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularStar, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './TrackerFavoriteButton.css';

const TrackerFavoriteButton = ({ flightData }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await axios.post('http://localhost:8080/favourites/checkFlight', {
          ident_iata: flightData.ident_iata,
          scheduled_out_date: flightData.scheduled_out_date,
          origin: flightData.origin,
          destination: flightData.destination,
        }, {
          withCredentials: true
        });

        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkIfFavorite();
  }, [flightData]);

  const handleFavoriteClick = async () => {
    try {
      const url = isFavorite
        ? 'http://localhost:8080/favourites/removeFlight'
        : 'http://localhost:8080/favourites/addFlight';

      const response = await axios.post(url, {
        ident_iata: flightData.ident_iata,
        scheduled_out_date: flightData.scheduled_out_date,
        origin: flightData.origin,
        destination: flightData.destination,
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setIsFavorite(!isFavorite);
        alert(isFavorite ? 'Removed from favorites!' : 'Flight added to favorites!');
      } else {
        alert('Failed to update favorite status.');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      alert('Error updating favorite status.');
    }
  };

  return (
    <button className="tracker-favorite-button" onClick={handleFavoriteClick}>
      <FontAwesomeIcon 
        icon={isFavorite ? solidStar : regularStar} 
        style={{ color: isFavorite ? 'yellow' : 'gray' }} 
      />
    </button>
  );
};

export default TrackerFavoriteButton;