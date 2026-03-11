import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import { PageTitle } from "../../../../../shared/components/layouts";
import {
  createPatient,
  updatePatient,
  getPatientByNumero,
  getAllDoctors,
  getFormData
} from "../../../services/patientServices.jsx";
import ProfilForm from "./ProfileForme.jsx";

export default function ProfilPageWorkspace() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const isNew = numero === "new";

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNew);

  //  Snapshot of last saved state for Cancel functionality
  const [savedFormData, setSavedFormData] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [formDataOptions, setFormDataOptions] = useState({ governorates: [], postalCodes: [] });

  const [formData, setFormData] = useState({
    id: null,
    numero: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "",

    birth_address_id: null,
    birth_governorate: "",
    birth_postal_code_id: "",

    residence_address_id: null,
    residence_governorate: "",
    residence_postal_code_id: "",

    exact_address: "",

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

        const [docs, formOptions] = await Promise.all([getAllDoctors(), getFormData()]);
        setDoctors(docs || []);
        setFormDataOptions(formOptions || { governorates: [], postalCodes: [] });

        if (!isNew) {
          const { patient } = await getPatientByNumero(numero);
          if (!patient) {
            toast.warning("Patient introuvable");
            navigate("/medecin/patients");
            return;
          }

          // ✅ Map patient -> formData shape (ONE source of truth)
          const mapped = {
            id: patient.id,
            numero: patient.numero || "",
            name: patient.name || "",
            surname: patient.surname || "",
            birthdate: patient.birthdate ? patient.birthdate.split("T")[0] : "",
            gender: patient.gender || "",

            // Adresse naissance
            birth_address_id: patient.birth_address_id || null,
            birth_governorate: patient.birth_governorate || "",
            birth_postal_code_id: patient.birth_postal_code_id || "",

            // Adresse résidence
            residence_address_id: patient.residence_address_id || null,
            residence_governorate: patient.residence_governorate || "",
            residence_postal_code_id: patient.residence_postal_code_id || "",

            // Exact address (résidence only)
            exact_address: patient.exact_address || "",

            phone: patient.phone || "",
            hospitalisation: patient.hospitalisation || "externe",
            doctor_id: patient.doctor_id || "",
            remarks: patient.remarks || ""
          };

          setFormData(mapped);
          setSavedFormData(mapped); // ✅ snapshot for Cancel
        } else {
          // New patient: no snapshot needed
          setSavedFormData(null);
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
        const confirmed = await confirmAction(
          "Enregistrer les modifications ?",
          "Les changements seront appliqués au dossier patient."
        );
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
        const response = await updatePatient(formData.id, formData);
        const updatedPatient = response?.patient;

        toast.success("Patient mis à jour avec succès");
        setIsEditing(false);

        // ✅ Update snapshot to the latest saved values
        setSavedFormData(formData);

        navigate(`/medecin/patient/${updatedPatient.numero}/workspace/profil`, { replace: true });
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
    if (savedFormData) {
      setFormData(savedFormData); // ✅ return to old values instead of clearing
    }
    setIsEditing(false);
    toast.info("Modifications annulées");
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <PageTitle title={isNew ? "Nouveau patient" : "Profil du patient"} />

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
