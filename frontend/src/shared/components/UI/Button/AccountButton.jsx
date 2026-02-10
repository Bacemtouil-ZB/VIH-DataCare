import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; // ton hook personnalisé
import './AccountButton.css';

function AccountButton() {
  const { user } = useAuth(); // ✅ récupère directement les données de l'utilisateur
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Calcul dynamique du chemin vers la page profil/settings selon le rôle et le parent
  const parentPath = location.pathname.split("/")[1]; // ex: 'admin' ou 'dashboard'
  const settingsPath = (() => {
    switch (user?.role) {
      case "admin":
        return "/admin/settings";
      case "analyst":
      case "pharmacien":
      case "medecin":
        return `/${parentPath}/settings`;
      default:
        return "/dashboard/settings";
    }
  })();

  return (
    <div className="account-dropdown">
      {open && (
        <ul className="account-menu overlay-top">
          {/* Lien vers les paramètres du compte */}
          <li className="nav-item">
            <NavLink
              to={settingsPath}
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <i className="bi bi-person-circle"></i>
              <span>Paramètres du compte</span>
            </NavLink>
          </li>

          {/* Déconnexion */}
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
