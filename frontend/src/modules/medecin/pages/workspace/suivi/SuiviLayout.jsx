import { NavLink, Outlet } from "react-router-dom";
import "./SuiviLayout.css"; // Import CSS for styling

export default function SuiviLayout() {
  return (
    <div className="suivi-container">

      {/* Tabs */}
      <div className="tabs">
        <NavLink to="Dashboard" className="tab-link">
            Patient Overview
        </NavLink>
        <NavLink to="Permissions" className="tab-link">
          Autorisations
        </NavLink>
        
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Outlet />
      </div>


    </div>
  );
}
