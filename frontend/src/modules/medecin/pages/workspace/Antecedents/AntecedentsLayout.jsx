import { NavLink, Outlet } from "react-router-dom";
import "./AntecedentsLayout.css";

export default function AntecedentsLayout() {
  return (
    <div className="antecedents-container">

      {/* Tabs */}
      <div className="tabs">
        <NavLink to="medical" className="tab-link">
          Médical
        </NavLink>

        <NavLink to="familial" className="tab-link">
          Familial
        </NavLink>

        <NavLink to="gyneco" className="tab-link">
          Gynécologique
        </NavLink>

        <NavLink to="therapeutic" className="tab-link">
          Thérapeutique
        </NavLink>

        <NavLink to="habitudes-vie" className="tab-link">
          Habitudes de Vie
        </NavLink>

        <NavLink to="surgical" className="tab-link">
          Chirurgical
        </NavLink>

        <NavLink to="transfusion" className="tab-link">
          Transfusion
        </NavLink>

        <NavLink to="tpe-prep" className="tab-link">
          TPE / PrEP
        </NavLink>
      </div>

      {/* Content */}
      <div className="tab-content">
        <Outlet />
      </div>

    </div>
  );
}