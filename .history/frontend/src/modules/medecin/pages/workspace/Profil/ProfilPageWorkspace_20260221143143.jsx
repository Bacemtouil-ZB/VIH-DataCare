import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import {
  createPatient,
  updatePatient,
  getPatientByNumero,
  getAllDoctors,
  getFormData
} from "../../../services/patientServices.jsx";
import ProfilForm from "../../../components/forms/ProfileForme.jsx";

export default function ProfilPageWorkspace() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const isNew = numero === "new";

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNew);
  const [initialData, setInitialData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formDataOptions, setFormDataOptions] = useState({ governorates: [], postalCodes: [] });

  const [formData, setFormData] = useState({
    id: null,
    numero: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "",
    birth_postal_code_id: "",
    residence_postal_code_id: "",
    phone: "",
    hospitalisation: "interne",
    doctor_id: "",
    remarks: ""
  });
  
  // ====== Chargement initial ======
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Médecins + options de formulaires
        const [docs, formOptions] = await Promise.all([getAllDoctors(), getFormData()]);
        setDoctors(docs || []);
        setFormDataOptions(formOptions || { governorates: [], postalCodes: [] });

        // Si patient existant
        if (!isNew) {
          const { patient } = await getPatientByNumero(numero);
          if (!patient) {
            toast.warning("Patient introuvable");
            navigate("/medecin/patients");
            return;
          }

          setFormData({
            id: patient.id,
            numero: patient.numero || "",
            name: patient.name || "",
            surname: patient.surname || "",
            birthdate: patient.birthdate ? patient.birthdate.split("T")[0] : "",
            gender: patient.gender || "",

            // Adresse naissance
            birth_address_id: patient.birth_address_id || null,        // ID de l'adresse
            birth_governorate: patient.birth_governorate || "",        // Nom du gouvernorat
            birth_postal_code_id: patient.birth_postal_code_id || "",  // ID du code postal
            birth_postal_code: patient.birth_postal_code || "",        // Code postal affichable

            // Adresse résidence
            residence_address_id: patient.residence_address_id || null, 
            residence_governorate: patient.residence_governorate || "",
            residence_postal_code_id: patient.residence_postal_code_id || "",
            residence_postal_code: patient.residence_postal_code || "",

            phone: patient.phone || "",
            hospitalisation: patient.hospitalisation || "externe",
            doctor_id: patient.doctor_id || "",
            remarks: patient.remarks || ""
          });
          setInitialData(patient);
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [numero, isNew, navigate]);

  // ====== Protection fermeture page ======
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditing && !isNew) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isEditing, isNew]);

  // ====== Submit patient ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!isNew) {
        // const confirmed = await confirmAction(
        //   "Enregistrer les modifications ?",
        //   "Les changements seront appliqués au dossier patient."
        // );

        if (!confirmed) {
          toast.info("Modification annulée");
          return;
        }
      }
     

      if (isNew) {
        const response = await createPatient(formData);
        toast.success("Patient créé avec succès");
        navigate(`/medecin/patient/${response.patient.numero}/workspace/profil`);
      } else {
        await updatePatient(formData.id, formData);
        console.log("Patient mis à jour:", formData);
        toast.success("Patient mis à jour avec succès");
        setIsEditing(false);
        setInitialData(formData);
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  // ====== Annuler modifications ======
  const handleCancel = () => {
    if (initialData) setFormData(initialData);
    setIsEditing(false);
    toast.info("Modifications annulées");
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <div className="page-header">
        <h2>{isNew ? "Nouveau patient" : "Profil du patient"}</h2>
      </div>

      <ProfilForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isNew={isNew}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onCancel={handleCancel}
        doctors={doctors}
        formDataOptions={formDataOptions}
      />
    </div>
  );
}


