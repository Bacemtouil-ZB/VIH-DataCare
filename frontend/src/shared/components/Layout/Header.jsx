import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';
import tn from '../../../assets/images/tn.png';

const Header = () => {
  const { user } = useAuth(); 
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <header className="header-custom">
      <div className="container-fluid px-4">
        <div className="row align-items-center">
          <div className="col-12 d-flex justify-content-between align-items-center">

            {/* Greeting gauche */}
            <div className="user-greeting">
              <img
                src={tn}
                alt="Drapeau Tunisie"
                className="flag-img"
              />
              <span className="greeting-text">{getGreeting()},</span>{" "}
              <strong>{user?.prenom || ""} {user?.nom || ""}</strong>
            </div>

            {/* Timer droite */}
            <div className="time-badge">
              <i className="bi bi-clock"></i>
              <span>{formatTime(currentTime)}</span>
              <span className="time-sep">·</span>
              <span>{formatDate(currentTime)}</span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;