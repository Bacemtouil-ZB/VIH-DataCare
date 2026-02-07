import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import AccountButton from '../UI/Button/AccountButton.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const Sidebar = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'medecin';
  
  // Configuration des liens par rôle
  const roleLinks = {
    admin: [
      {
        to: '/UsersPage',
        icon: 'bi-people-fill',
        label: 'Utilisateurs'
      },
      {
        to: '/TreatmentManagement',
        icon: 'bi-capsule-pill',
        label: 'Traitements'
      },
      {
        to: '/dashbords',
        icon: 'bi-speedometer2',
        label: 'Dashboard'
      },
 
    ],
    medecin: [
      {
        to: '/mainPageMed',
        icon: 'bi-person-hearts',
        label: 'Mes Patients'
      },
      {
        to: '/dashbords',
        icon: 'bi-speedometer2',
        label: 'Dashboard'
      },

    ],
    pharmacien: [
      {
        to: '/stock',
        icon: 'bi-box-seam',
        label: 'Stock'
      },
      {
        to: '/dashbords',
        icon: 'bi-speedometer2',
        label: 'Dashboard'
      },


    ],
    analyste: [
      {
        to: '/statistiques',
        icon: 'bi-graph-up',
        label: 'Statistiques'
      },
      {
        to: '/rapports',
        icon: 'bi-file-earmark-text',
        label: 'Rapports'
      },
      {
        to: '/dashbords',
        icon: 'bi-speedometer2',
        label: 'Dashboard'
      },

    ]
  };

  // Utiliser les liens personnalisés ou ceux du rôle
  const links =  roleLinks[userRole] ;

  return (
    <div className="sidebar-custom d-flex flex-column" style={{ width: '240px', minHeight: '100vh' }}>
      {/* Logo / En-tête avec cœur et VIHDataCare */}
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
        {/* Bouton Déconnexion */}
        <AccountButton />
      </div>
    </div>
  );
};

export default Sidebar;