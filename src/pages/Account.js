  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import './Account.css';
  import NavbarMainComponent from '../components/NavbarMain';
  import NavbarComponent from '../components/Navbar';
  import FooterComponent from '../components/Footer';
  import ChatbotComponent from '../components/Chatbot/Chatbot.js';

  function Account({ isLoggedIn, userEmail, setIsLoggedIn }) {
    const [userData, setUserData] = useState({
      name: '',
      email: '',
      phonenum: '',
      country: '',
      type: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchAccountInfo = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/user/account', {
            withCredentials: true,
          });
          setUserData(response.data);
        } catch (error) {
          console.error('Error fetching account information:', error);
          if (error.response && error.response.status === 401) {
            alert("Session expired. Please log in again.");
            window.location.href = '/login';
          }
        }
      };

      fetchAccountInfo();
    }, []);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUserData({ ...userData, [name]: value });
    };

    const handleSaveChanges = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/user/update', userData, {
          withCredentials: true,
        });
        setUserData(response.data);
        setIsEditing(false);
        alert('Account information updated successfully!');
      } catch (error) {
        console.error('Error updating account information:', error);
        alert('Failed to update account information.');
      }
    };

    const handleUpgrade = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/user/upgrade', {}, {
          withCredentials: true,
        });
        alert('Successfully upgraded to member!');
        // Optionally, refresh the account info to show updated user data
        setUserData((prevData) => ({
          ...prevData,
          type: 'Member',  
        }));
      } catch (error) {
        console.error('Error upgrading account:', error);
        alert('Failed to upgrade account.');
      }
    };

    return (
      <div className="account-page">
        <NavbarComponent isLoggedIn={isLoggedIn} userEmail={userEmail} setIsLoggedIn={setIsLoggedIn} />
        <br></br>
        <div className="account-info">
          <h2>Account Information</h2>
          {userData ? (
            <div>
              <div className="input-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="input-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phonenum"
                  value={userData.phonenum}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="input-group">
                <label>Country:</label>
                <input
                  type="text"
                  name="country"
                  value={userData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="input-group">
                <label>Account Type:</label>
                <input
                  type="text"
                  name="type"
                  value={userData.type}
                  disabled
                />
              </div>
              {isEditing ? (
                <button onClick={handleSaveChanges} className="save-button">
                  Save Changes
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-button">
                  Edit Information
                </button>
              )}
              {/* <button onClick={handleUpgrade} className="upgrade-button">
                Upgrade
              </button> */}
            </div>
          ) : (
            <p>Loading account information...</p>
          )}
        </div>
        <br></br>
        <br></br>
        <ChatbotComponent/>
        <FooterComponent />
      </div>
    );
  }

  export default Account;