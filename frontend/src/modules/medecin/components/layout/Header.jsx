import React, { useState, useEffect } from "react";
import "./Header.css";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute (more professional)
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="workspace-header">
      <div className="header-left">
        <span className="workspace-title">Workspace</span>
      </div>

      <div className="header-right">
        <span className="header-time">
          {formatTime(currentTime)}
        </span>

        <button className="header-btn">⚙</button>
        <button className="header-btn">⎋</button>
      </div>
    </header>
  );
}
