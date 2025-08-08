// src/components/TrackerBookingButton.js

import React from 'react';
import './BookingButton.css';


function TrackerBookingButton() {
  const handleBooking = () => {
    window.location.href = 'https://www.expedia.com/Flights';
  };

  return (
    <button onClick={handleBooking} className="tracker-booking-button">
      Book Ticket
    </button>
  );
}

export default TrackerBookingButton;