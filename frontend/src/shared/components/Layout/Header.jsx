import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ userName = "Docteur", userPrenom = "" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
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
          {/* Section droite - tout aligné à droite */}
          <div className="col-12 d-flex justify-content-end">
            <div className="header-right-content">
              {/* User Info */}
              <div className="user-greeting">
                <span className="text-muted">
                  {getGreeting()}, <strong>Dr. {userPrenom} {userName}</strong>
                </span>
              </div>
              {/* Time Display */}
              <div className="time-badge">
                <i className="bi bi-clock me-1"></i>
                <span>{formatTime(currentTime)}</span>&nbsp;/&nbsp;
                <span>{formatDate(currentTime)}</span>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;