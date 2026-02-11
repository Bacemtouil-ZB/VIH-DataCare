import "./resultats_biologiquesLayout.css";
import { NavLink, Outlet } from "react-router-dom";

export default function ResultatsBiologiquesLayout() {
  return (
    <div className="examen-container">

      {/* Tabs */}
      <div className="tabs">
        <NavLink to="standard" className="tab-link">
            Standard
        </NavLink>

        <NavLink to="serologie" className="tab-link">
          Sérologie
        </NavLink>

        <NavLink to="microbiologie" className="tab-link">
          Microbiologie
        </NavLink>
        
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Outlet />
      </div>

    </div>
  );
}
