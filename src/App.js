import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import FlightTracker from './pages/FlightTracker';
import Prediction from './pages/Prediction';
import WeatherForecast from './pages/WeatherForecast';
import TicketSearch from './pages/TicketSearch';
import Login from './pages/Login';
import Register from './pages/Register'; 
import Account from './pages/Account'; 
import About from './pages/About'; 
import NotificationPage from './pages/NotificationPage';
import Admin from './pages/Admin';
import Membership from './pages/Membership';
import FavoritePage from './pages/FavoritePage'; 
import FavoriteDetail from './pages/FavoriteDetail'; 
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<MainPage isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/flight-tracker" 
          element={<FlightTracker isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/prediction" 
          element={<Prediction isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/weather-forecast" 
          element={<WeatherForecast isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/ticket-search" 
          element={<TicketSearch isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/login" 
          element={<Login setLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />} 
        />
        <Route 
          path="/register" 
          element={<Register isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/account" 
          element={<Account isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/about" 
          element={<About isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/membership" 
          element={<Membership isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/notifications" 
          element={<NotificationPage isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/admin" 
          element={<Admin isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/favorites" 
          element={<FavoritePage isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/favoritedetail" 
          element={<FavoriteDetail isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;