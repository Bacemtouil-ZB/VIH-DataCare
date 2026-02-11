import { NavLink } from "react-router-dom";
import "./RightPanel.css";

export default function RightPanel() {
  return (
    <div className="right-menu">

      <NavLink to="profil" className="menu-item">Profil</NavLink>

      <NavLink to="social" className="menu-item">Social</NavLink>

      <NavLink to="vih" className="menu-item">VIH</NavLink>

      <NavLink to="antecedents" className="menu-item">Antécédents</NavLink>

      <NavLink to="examen-cliniques" className="menu-item">Examen clinique</NavLink>

      <NavLink to="biologie" className="menu-item">Résultats biologiques</NavLink>

      <NavLink to="prescription-examens" className="menu-item">Prescription d'examens</NavLink>

      <NavLink to="prescription-medicale" className="menu-item">Prescription médicale</NavLink>

      <NavLink to="conclusion" className="menu-item">Conclusion</NavLink>

      <NavLink to="suivi" className="menu-item">Suivi</NavLink>

    </div>
  );
}
