import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import AccountButton from '../UI/Button/AccountButton.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const Sidebar = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'medecin';
  
  // Configuration des liens par rÃ´le
  const roleLinks = {
    admin: [
      {
        to: 'users', // ajouter admin pour asuurer que css isActive fonctionne correctement
        icon: 'bi-people-fill',
        label: 'Utilisateurs',
        end : true,
      },
      {
        to: 'audit-logs',
        icon: 'bi-exclamation-triangle',
        label: 'Audit patient',
        end : true,
      },
        {
      to: "settings",
      icon: "bi-person-gear",
      label: "Gestion profil",
      end: true,
    },
     
 
    ],
    
    medecin: [
    {
      to: "/medecin/patients",
      icon: "bi-person-hearts",
      label: "Mes Patients",
      end : true,
    },
    {
      to: "settings",
      icon: "bi-person-gear",
      label: "Gestion profil",
      end: true,
    },
  ],

  pharmacien: [

    {
      to: "prescriptions-medicales",
      icon: "bi-people-fill",
      label: "Prescriptions",
      end : true,
    },
    {
      to: "stock",
      icon: "bi-box-seam",
      label: "Stock",
      end : true,
    },
    {
      to: "settings",
      icon: "bi-person-gear",
      label: "Gestion profil",
      end: true,
    },

  ],

  analyste: [
    {
      to: "/analyste/statistiques",
      icon: "bi-graph-up",
      label: "Statistiques",
      end : true,
    },
    {
      to: "rapports",
      icon: "bi-file-earmark-text",
      label: "Rapports",
      end : true,
    },
    {
      to: "dashboard",
      icon: "bi-speedometer2",
      label: "Dashboard",
      end : true,
    },
    {
      to: "settings",
      icon: "bi-person-gear",
      label: "Gestion profil",
      end: true,
    },
  ],
  };

  // Utiliser les liens personnalisÃ©s ou ceux du rÃ´le
  const links =  roleLinks[userRole] ;

  return (
    <div className="sidebar-custom d-flex flex-column" style={{ width: '240px', minHeight: '100vh' }}>
      {/* Logo / En-tÃªte avec cÅ“ur et VIHDataCare */}
      <div className="sidebar-header py-3 px-4">
        <div className="text-center sidebar-header-content">
          <div className="heart-icon-container mb-2">
            <i className="bi bi-heart-pulse-fill sidebar-heart-icon"></i>
          </div>
          <h4 className="sidebar-title mb-0">VIHDataCare</h4>
          <small className="sidebar-subtitle d-block mb-3">
            Système Médical
          </small>
        </div>
      </div>

      {/* Section de navigation */} 
      <nav className="flex-grow-1 py-2">
        <ul className="nav flex-column px-2 sidebar-nav">
          {links.map((link, index) => (
            <li className="nav-item" key={index}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `nav-link sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <i className={`bi ${link.icon}`}></i>
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Section Footer */}
      <div className="sidebar-footer-section px-3 py-4 border-top">
        {/* Bouton DÃ©connexion */}
        <AccountButton />
      </div>
    </div>
  );
};

export default Sidebar;

