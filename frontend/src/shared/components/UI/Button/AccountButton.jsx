import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import './AccountButton.css';

function AccountButton() {
  const { user, handleLogout } = useAuth(); // ✅ récupère user et handleLogout
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Déconnexion
  const onLogoutClick = async () => {
    try {
      await handleLogout(); // Supprime le cookie + reset user
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  // Calcul dynamique du chemin vers la page profil/settings selon le rôle et le parent
  const parentPath = location.pathname.split("/")[1]; 
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
          <li className="danger">
            <NavLink
              to="/login"
              onClick={onLogoutClick} // Déconnexion avant la navigation
              className="nav-link"
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Déconnexion
            </NavLink>
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