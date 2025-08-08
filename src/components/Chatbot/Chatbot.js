import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Chatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import config from './config';
import './Chatbot.css';

function ChatbotComponent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMinimized, setIsMinimized] = useState(!isHomePage);

  useEffect(() => {
    setIsMinimized(!isHomePage);
  }, [location.pathname, isHomePage]);

  const toggleChatbot = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : 'expanded'}`}>
      <div className="chatbot-header" onClick={toggleChatbot}>
        {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {!isMinimized && (
        <div className="chatbot-content">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
}

export default ChatbotComponent;
