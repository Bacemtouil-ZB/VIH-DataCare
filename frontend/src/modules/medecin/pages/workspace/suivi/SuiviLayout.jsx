import { NavLink, Outlet } from "react-router-dom";
import "./SuiviLayout.css"; // Import CSS for styling

export default function SuiviLayout() {
  return (
    <div className="suivi-container">

      {/* Tabs */}
      <div className="tabs">
        <NavLink to="Dashbord" className="tab-link">
            Patient Overview
        </NavLink>

        <NavLink to="controleTherapeutique" className="tab-link">
          Controle Therapeutique
        </NavLink>

      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Outlet />
      </div>

    </div>
  );
}
