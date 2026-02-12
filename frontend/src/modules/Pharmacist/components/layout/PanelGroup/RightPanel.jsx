import { NavLink } from "react-router-dom";
import {
  User,
  Users,
  ShieldPlus,
  History,
  Stethoscope,
  FlaskConical,
  ClipboardList,
  Pill,
  FileText,
  Activity,
} from "lucide-react";

import "./RightPanel.css";

export default function RightPanel() {
  return (
    <div className="right-menu">

      <NavLink to="#prescriptions" className="menu-item">
        <User size={18} />
        <span>Ordonnances</span>
      </NavLink>

     
    </div>
  );
}
