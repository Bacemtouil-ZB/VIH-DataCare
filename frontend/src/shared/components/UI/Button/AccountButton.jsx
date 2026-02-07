import { useState } from "react";
import { NavLink } from 'react-router-dom'
import './AccountButton.css';

function AccountButton() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const [open, setOpen] = useState(false);
  

  return (
    <div className="account-dropdown">
      {/* Menu overlay au-dessus */}
      
      {open && (
        <ul className="account-menu overlay-top">
      {/* <li>
        <i className="bi bi-gear-fill me-2"></i>
        Paramètres du compte
      </li> */}
      <li className="nav-item">
                  <NavLink
                    to="/ProfilePageMed"
                    className={({ isActive }) =>
                      `nav-link sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <i className="bi bi-person-circle"></i>
                    <span>Paramètres du compte</span>
                  </NavLink>
                </li>
      <li className="danger" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i>
        Déconnexion
      </li>
    </ul>
      )}

      {/* Bouton icône */}
      <button
        className={`account-button ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        
      >
        <i className="bi bi-person-circle"></i> 
      </button>
    </div>
  );
}

export default AccountButton;
