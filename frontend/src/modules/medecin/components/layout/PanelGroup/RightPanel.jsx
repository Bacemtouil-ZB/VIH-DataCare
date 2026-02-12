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

      <NavLink to="profil" className="menu-item">
        <User size={18} />
        <span>Profil</span>
      </NavLink>

      <NavLink to="social" className="menu-item">
        <Users size={18} />
        <span>Social</span>
      </NavLink>

      <NavLink to="vih" className="menu-item">
        <ShieldPlus size={18} />
        <span>VIH</span>
      </NavLink>

      <NavLink to="antecedents" className="menu-item">
        <History size={18} />
        <span>Antécédents</span>
      </NavLink>

      <NavLink to="examen-cliniques" className="menu-item">
        <Stethoscope size={18} />
        <span>Examen clinique</span>
      </NavLink>

      <NavLink to="biologie" className="menu-item">
        <FlaskConical size={18} />
        <span>Résultats biologiques</span>
      </NavLink>

      <NavLink to="prescription-examens" className="menu-item">
        <ClipboardList size={18} />
        <span>Prescription d'examens</span>
      </NavLink>

      <NavLink to="prescription-medicale" className="menu-item">
        <Pill size={18} />
        <span>Prescription médicale</span>
      </NavLink>

      <NavLink to="conclusion" className="menu-item">
        <FileText size={18} />
        <span>Conclusion</span>
      </NavLink>

      <NavLink to="suivi" className="menu-item">
        <Activity size={18} />
        <span>Suivi</span>
      </NavLink>

    </div>
  );
}
