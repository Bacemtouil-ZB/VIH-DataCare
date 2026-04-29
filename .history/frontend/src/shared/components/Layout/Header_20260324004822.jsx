import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (date) =>
    date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <header className="header-custom">
      <div className="header-inner">

        {/* Greeting */}
        <div className="header-greeting">
          <span className="greeting-text">{getGreeting()},</span>
          <strong className="greeting-name">
            {user?.prenom || ''} {user?.nom || ''}
          </strong>
        </div>

        {/* Divider */}
        <div className="header-divider" />

        {/* Time */}
        <div className="time-badge">
          <i className="bi bi-clock-fill" />
          <span className="time-time">{formatTime(currentTime)}</span>
          <span className="time-sep">/</span>
          <span className="time-date">{formatDate(currentTime)}</span>
        </div>

      </div>
    </header>
  );
};

export default Header;