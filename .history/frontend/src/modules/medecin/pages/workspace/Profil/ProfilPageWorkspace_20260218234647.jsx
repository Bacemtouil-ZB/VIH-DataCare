import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Alert } from "../../../../../shared/utils/alertService.js";
import {
  createPatient,
  updatePatient,
  getPatientByNumero,
  getAllDoctors,
  getFormData
} from "../../../services/patientServices.jsx";
import ProfilForm from "../../../components/forms/ProfileForme.jsx";

// Convertit "" / undefined / NaN → null
const toIntOrNull = (value) => (!value ? null : parseInt(value, 10));

export default function ProfilPageWorkspace() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const isNew = numero === "new";

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNew);
  const [formData, setFormData] = useState({
    numero: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "",
    birth_postal_code_id: "",
    residence_postal_code_id: "",
    residence_exact_address: "",
    phone: "",
    hospitalisation: "externe",
    doctor_id: "",
    remarques: "",
    id: null
  });
  const [initialData, setInitialData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formDataOptions, setFormDataOptions] = useState({
    governorates: [],
    postalCodes: []
  });

  // Mapper backend → formulaire
  const mapPatientToForm = (data) => ({
    id: data.id,
    numero: data.numero || data.numero_dossier || "",
    name: data.name || "",
    surname: data.surname || "",
    birthdate: data.birthdate ? data.birthdate.split("T")[0] : "",
    gender: data.gender || "",
    birth_postal_code_id: data.birth_address_id || "",
    residence_postal_code_id: data.residence_address_id || "",
    residence_exact_address: data.residence_exact_address || "",
    phone: data.phone || "",
    hospitalisation: data.hospitalisation || "externe",
    doctor_id: data.doctor_id || "",
    remarques: data.remarques || ""
  });

  // Chargement initial
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [docs, { governorates, postalCodes }] = await Promise.all([
          getAllDoctors(),
          getFormData()
        ]);
        setDoctors(docs || []);
        setFormDataOptions({ governorates, postalCodes });

        if (!isNew) {
          const data = await getPatientByNumero(numero);
          if (!data) {
            toast.warning("Patient introuvable");
            return navigate("/medecin/patients");
          }
          const mapped = mapPatientToForm(data);
          setFormData(mapped);
          setInitialData(mapped);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [numero, isNew, navigate]);

  // Protection fermeture page
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

  // Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // confirmation pour update
      if (!isNew) {
        const result = await Alert.fire({
          title: "Enregistrer les modifications ?",
          html: "<p>Les changements seront appliqués au dossier patient.</p>",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Confirmer",
          cancelButtonText: "Annuler"
        });
        if (!result.isConfirmed) return toast.info("Modification annulée");
      }

      // Préparer IDs safe
      const payload = {
        ...formData,
        birth_address_id: toIntOrNull(formData.birth_postal_code_id),
        residence_address_id: toIntOrNull(formData.residence_postal_code_id),
        doctor_id: toIntOrNull(formData.doctor_id)
      };

      if (isNew) {
        const res = await createPatient(payload);
        toast.success("Patient créé avec succès");
        navigate(`/medecin/patient/${res.numero}/workspace/profil`);
      } else {
        await updatePatient(formData.id, payload);
        toast.success("Patient mis à jour avec succès");
        setIsEditing(false);
        setInitialData(formData);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

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
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onCancel={handleCancel}
        doctors={doctors}
        formDataOptions={formDataOptions}
        isNew={isNew}
      />
    </div>
  );
}
