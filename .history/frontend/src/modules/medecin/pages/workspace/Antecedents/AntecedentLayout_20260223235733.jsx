import { NavLink, Outlet } from "react-router-dom";
import "./AntecedentLayout.css"; // Import the CSS file for styling
export default function AntecedentsLayout() {
  return (
    <div className="antecedent-container">

      <div className="tabs">
        <NavLink to="historique" className="tab-link">
          Historique
        </NavLink>

        <NavLink to="therapeutique" className="tab-link">
          Thérapeutique
        </NavLink>

        <NavLink to="carnet-de-vaccination" className="tab-link">
          Carnet de vaccination
        </NavLink>

        <NavLink to="antecedents" className="tab-link">
          Antécédents
        </NavLink>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Outlet />
      </div>

    </div>
  );
}
