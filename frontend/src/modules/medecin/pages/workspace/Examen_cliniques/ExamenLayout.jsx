import { NavLink, Outlet } from "react-router-dom";
import "./ExamenLayout.css";

export default function ExamenLayout() {
  return (
    <div className="examen-container">

      {/* Tabs */}
      <div className="tabs">
        <NavLink to="signesCliniques" className="tab-link">
          Signes Cliniques
        </NavLink>

        <NavLink to="signesFonctionnels" className="tab-link">
          Signes Fonctionnels
        </NavLink>

        <NavLink to="habitudes" className="tab-link">
          Habitudes de Vie
        </NavLink>
        <NavLink to="observation" className="tab-link">
          Observation
        </NavLink>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Outlet />
      </div>

    </div>
  );
}
