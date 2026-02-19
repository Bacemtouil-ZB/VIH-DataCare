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

export default function ProfilPageWorkspace() {
  const { numero } = useParams();
  const navigate = useNavigate();

  const isNew = numero === "new";

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNew);
  const [initialData, setInitialData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formDataOptions, setFormDataOptions] = useState({
    governorates: [],
    postalCodes: []
  });

  const [formData, setFormData] = useState({
    numero: "",
    name: "",
    surname: "",
    birthdate: "",
    gender: "",
    birth_governorate: "",
    birth_postal_code_id: "",
    residence_governorate: "",
    residence_postal_code_id: "",
    residence_exact_address: "",
    phone: "",
    hospitalisation: "externe",
    doctor_id: "",
    remarques: "",
    id: null
  });

  /* ==============================
      Chargement initial
  ============================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Charger médecins
        const docs = await getAllDoctors();
        setDoctors(docs || []);

        // Charger gouvernorats et codes postaux
        const { governorates, postalCodes } = await getFormData();
        console.log("GOV exemple:", governorates[0]);
        console.log("PC exemple:", postalCodes[0]);
        setFormDataOptions({ governorates, postalCodes });

        // Charger patient existant
        if (!isNew) {
          const data = await getPatientByNumero(numero);
          if (!data) {
            toast.warning("Patient introuvable");
            navigate("/medecin/patients");
            return;
          }

          setFormData({
            numero: data.numero_dossier || "",
            name: data.name || "",
            surname: data.surname || "",
            birthdate: data.birthdate ? data.birthdate.split("T")[0] : "",
            gender: data.gender || "",
            birth_governorate: data.birth_governorate || "",
            birth_postal_code_id: data.birth_postal_code_id || "",
            residence_governorate: data.residence_governorate || "",
            residence_postal_code_id: data.residence_postal_code_id || "",
            residence_exact_address: data.residence_exact_address || "",
            phone: data.phone || "",
            hospitalisation: data.hospitalisation || "externe",
            doctor_id: data.doctor_id || "",
            remarques: data.remarques || "",
            id: data.id
          });
          setInitialData(data);
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [numero, isNew, navigate]);

  /* ==============================
      Protection fermeture page
  ============================== */
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

  /* ==============================
      Submit sécurisé
  ============================== */
  /* ==============================
   Submit sécurisé avec gestion des adresses
============================== */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isNew) {
    const result = await Alert.fire({
      title: "Enregistrer les modifications ?",
      html: `<p class="mb-2">Les changements seront appliqués au dossier patient.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) {
      toast.info("Modification annulée");
      return;
    }
  }

  try {
    setLoading(true);

    // ----------- Gestion des adresses -----------

    // Fonction utilitaire pour créer ou récupérer l'adresse
    const resolveAddress = async (postalCodeId, exactAddress) => {
      if (!postalCodeId) return null;

      // Ici, on suppose que tu as un endpoint backend pour vérifier / créer l'adresse
      // POST /api/addresses { postal_code_id, exact_address }
      // et il retourne l'id
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postal_code_id: postalCodeId, exact_address: exactAddress || "" })
      });

      const data = await response.json();
      return data.id; // id de l'adresse
    };

    const birthAddressId = await resolveAddress(
      formData.birth_postal_code_id,
      formData.birth_exact_address
    );

    const residenceAddressId = await resolveAddress(
      formData.residence_postal_code_id,
      formData.residence_exact_address
    );

    // ----------- Préparer payload patient -----------

    const patientPayload = {
      numero: formData.numero,
      name: formData.name,
      surname: formData.surname,
      birthdate: formData.birthdate,
      gender: formData.gender,
      birth_address_id: birthAddressId,
      residence_address_id: residenceAddressId,
      phone: formData.phone,
      hospitalisation: formData.hospitalisation,
      last_visit_date: formData.last_visit_date || null,
      doctor_id: formData.doctor_id || null,
      remarques: formData.remarques || null
    };

    // ----------- Création ou mise à jour -----------

    if (isNew) {
      const response = await createPatient(patientPayload);
      console.log("Patient créé:", response);
      toast.success("Patient créé avec succès");

      // Navigation avec le vrai numero
      navigate(`/medecin/patient/${response.numero}/workspace/profil`);
    } else {
      const response = await updatePatient(formData.id, patientPayload);
      console.log("Patient mis à jour:", response);
      toast.success("Patient mis à jour avec succès");
      setIsEditing(false);
      setInitialData(patientPayload);
    }

  } catch (error) {
    console.error("Erreur:", error);
    toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
  } finally {
    setLoading(false);
  }
};

  /* ==============================
      Annuler modification
  ============================== */
  const handleCancel = () => {
    if (initialData) setFormData(initialData);
    setIsEditing(false);
    toast.info("Modifications annulées");
  };

  /* ==============================
      Loading UI
  ============================== */
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
        formDataOptions={formDataOptions} // <-- pass options ici
      />
    </div>
  );
}



