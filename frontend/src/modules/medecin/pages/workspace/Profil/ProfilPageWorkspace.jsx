import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createPatient,
  updatePatient,
  getPatientByNumero
} from "../../../services/patientServices.jsx";
import ProfilForm from "../../../components/forms/ProfileForme.jsx";

export default function ProfilPageWorkspace() {
  const { numero } = useParams();
  const navigate = useNavigate();

  const isNew = numero === "new";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    numero: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "",
    city_of_birth: "",
    city_of_residence: "",
    phone: "",
    address: "",
    hospitalisation: "externe",
  });

  // Charger patient existant
  useEffect(() => {
    if (!isNew) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          const data = await getPatientByNumero(numero);
          const patient = data.patient || data;

          if (patient) {
            setFormData({
              ...patient,
              birthdate: patient.birthdate
                ? patient.birthdate.split("T")[0]
                : "",
            });
          }
        } catch (error) {
          console.error("Erreur chargement patient:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPatient();
    }
  }, [numero, isNew]);

  // Changement champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CREATE ou UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isNew) {
        const response = await createPatient(formData);
        const newNumero = response.patient?.numero || response.numero;

        alert("Patient créé avec succès");

        navigate(`/medecin/patient/${newNumero}/workspace/profil`);
      } else {
        await updatePatient(formData.id, formData);
        alert("Patient mis à jour avec succès");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <div className="page-header">
        <h2>{isNew ? "Nouveau patient" : "Profil du patient"}</h2>
      </div>

      <ProfilForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isNew={isNew}
      />
    </div>
  );
}