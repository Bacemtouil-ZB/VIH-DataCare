import React, { useState, useEffect } from "react";
import { Settings, LogOut, ArrowLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
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

      {/* LEFT SIDE */}
      <div className="header-left">
        <NavLink to="/medecin" className="icon-btn">
          <ArrowLeft size={16} />
        </NavLink>

        <span className="workspace-title">
          Patient Workspace
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="header-right">
        <span className="header-time">
          {formatTime(currentTime)}
        </span>

        <button className="icon-btn">
          <Settings size={16} />
        </button>

        <button className="icon-btn danger">
          <LogOut size={16} />
        </button>
      </div>

    </header>
  );
}
