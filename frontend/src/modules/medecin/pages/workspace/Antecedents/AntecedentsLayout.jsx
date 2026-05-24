
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPatientByNumero } from "../../../services/patientServices";
import "./AntecedentsLayout.css";

export default function AntecedentsLayout() {
  const { numero } = useParams();
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  if (!numero) return;
  getPatientByNumero(numero)
    .then((data) => setGender(data?.patient?.gender || null)) // data.patient.gender
    .catch(() => setGender(null))
    .finally(() => setLoading(false));
}, [numero]);

  const isFemme = gender === "femme";

  return (
    <div className="antecedents-container">
      <div className="tabs">
        <NavLink to="medical" className="tab-link">Médical</NavLink>
        <NavLink to="familial" className="tab-link">Familial</NavLink>

        {!loading && isFemme && (
          <NavLink to="gyneco" className="tab-link">Gynécologique</NavLink>
        )}

        <NavLink to="therapeutic" className="tab-link">Thérapeutique</NavLink>
        <NavLink to="habitudes-vie" className="tab-link">Habitudes de Vie</NavLink>
        <NavLink to="surgical" className="tab-link">Chirurgical</NavLink>
        <NavLink to="transfusion" className="tab-link">Transfusion</NavLink>
        <NavLink to="tpe-prep" className="tab-link">TPE / PrEP</NavLink>
      </div>

      <div className="tab-content">
        <Outlet context={{ gender, isFemme }} />
      </div>
    </div>
  );
}