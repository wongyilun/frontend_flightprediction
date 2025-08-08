import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as regularStar, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './TicketFavoriteButton.css';

const TicketFavoriteButton = ({ flightData, isRoundTrip }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const url = isRoundTrip
          ? 'http://localhost:8080/favourites/checkTicketReturn'
          : 'http://localhost:8080/favourites/checkTicketOneway';

        const data = isRoundTrip
          ? {
              iataCodeFlight_1: flightData.itineraries[0].flightNumber,
              iataCodeFlight_2: flightData.itineraries[1].flightNumber,
              departureDate_1: flightData.itineraries[0].departure.date,
              departureDate_2: flightData.itineraries[1].departure.date,
            }
          : {
              iataCodeFlight: flightData.itineraries[0].flightNumber,
              departureDate: flightData.itineraries[0].departure.date,
            };

        const response = await axios.post(url, data, { withCredentials: true });
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkIfFavorite();
  }, [flightData, isRoundTrip]);

  const handleFavoriteClick = async () => {
    try {
      const url = isFavorite
        ? (isRoundTrip ? 'http://localhost:8080/favourites/removeTicketReturn' : 'http://localhost:8080/favourites/removeTicketOneway')
        : (isRoundTrip ? 'http://localhost:8080/favourites/addTicketReturn' : 'http://localhost:8080/favourites/addTicketOneway');

      const data = isRoundTrip
        ? {
            iataCodeFlight_1: flightData.itineraries[0].flightNumber,
            iataCodeFlight_2: flightData.itineraries[1].flightNumber,
            departureDate_1: flightData.itineraries[0].departure.date,
            departureDate_2: flightData.itineraries[1].departure.date,
          }
        : {
            iataCodeFlight: flightData.itineraries[0].flightNumber,
            departureDate: flightData.itineraries[0].departure.date,
          };

      const response = await axios.post(url, data, { withCredentials: true });

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
    <button 
      className={`ticket-favorite-button ${isFavorite ? 'favorited' : ''}`} 
      onClick={handleFavoriteClick}
    >
      <FontAwesomeIcon icon={isFavorite ? solidStar : regularStar} />
    </button>
  );
};

export default TicketFavoriteButton;
