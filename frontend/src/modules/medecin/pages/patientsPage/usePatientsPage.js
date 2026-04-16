
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPatients } from "../../services/patientServices.jsx";
//dans shared car utilisé aussi par ordonnance
import { getLastPrescriptionPerPatient } from "../../../../shared/services/prescriptionWorkflowService.jsx";
import { getNextRendezVousPerPatient }  from "../../services/rendezvousService.jsx";
import { filterPatients }  from "./patientsPageHelpers.js";

const usePatientsPage = () => {
  const navigate = useNavigate();

  // ── Raw data ───────────────────────────────────────────────────────────────
  const [patients,  setPatients]  = useState([]);
  // prescMap shape: { [patient_id]: { traitement: string, derniere_consultation: string|null } }
  const [prescMap,  setPrescMap]  = useState({});
  // rdvMap shape:   { [patient_id]: { date, heure, type, statut } }
  const [rdvMap,    setRdvMap]    = useState({});
  const [loading,   setLoading]   = useState(true);

  // ── Filter state ───────────────────────────────────────────────────────────
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("");   // hospitalisation
  const [rdvFilter, setRdvFilter] = useState("");   // rdv timing

  // ── Fetch all data on mount ────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [response, prescData, rdvData] = await Promise.all([
          getAllPatients(),
          getLastPrescriptionPerPatient(),   // { [patient_id]: { traitement, derniere_consultation } }
          getNextRendezVousPerPatient(),     // { [patient_id]: { date, heure, type, statut } }
        ]);

        setPatients(response.patients || response || []);
        setPrescMap(prescData);
        setRdvMap(rdvData);
      } catch (error) {
        console.error("Erreur chargement patients:", error);
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ── Derived: filtered patients ─────────────────────────────────────────────
  const filteredPatients = useMemo(
    () => filterPatients(patients, { search, filter, rdvFilter, rdvMap }),
    [patients, search, filter, rdvFilter, rdvMap]
  );

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleNewPatient = () => navigate("/medecin/patient/new/workspace");

  return {
    // data
    filteredPatients,
    prescMap,
    rdvMap,
    loading,
    // filters
    search,    setSearch,
    filter,    setFilter,
    rdvFilter, setRdvFilter,
    // actions
    handleNewPatient,
  };
};

export default usePatientsPage;