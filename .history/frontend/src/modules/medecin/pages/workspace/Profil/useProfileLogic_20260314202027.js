import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import {
  createPatient,
  updatePatient,
  getPatientByNumero,
  getAllDoctors,
  getFormData,
} from "../../../services/patientServices.jsx";
import {
  sanitizeText,
  normalizeNumero,
  isNumeroValid,
  filterPostalCodesByGovernorate,
} from "./profileHelpers.js";
// Utilitaire pour effacer l'erreur d'un champ spécifique
import { clearFieldError } from "../../../shared/utils/clearFieldError.js";

export function useProfileLogic() {
  const { numero } = useParams();
  const navigate = useNavigate();
  const isNew = numero === "new"; // si "new", on est en création, sinon édition

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(isNew);
  const [errors, setErrors] = useState({});
  const [savedFormData, setSavedFormData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [formDataOptions, setFormDataOptions] = useState({
    governorates: [],
    postalCodes: [],
  });
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
    remarks: "",
  });

  // ====== Derived data ======
  const { governorates, postalCodes } = formDataOptions;

  const filteredBirthPostalCodes = filterPostalCodesByGovernorate(
    postalCodes,
    formData.birth_governorate,
  );
  const filteredResidencePostalCodes = filterPostalCodesByGovernorate(
    postalCodes,
    formData.residence_governorate,
  );
  const canEditNumero = isNew;
  const numeroHasError = formData.numero && !isNumeroValid(formData.numero);

  // ====== Chargement initial ======
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [docs, formOptions] = await Promise.all([
          getAllDoctors(),
          getFormData(),
        ]);
        setDoctors(docs || []);
        setFormDataOptions(
          formOptions || { governorates: [], postalCodes: [] },
        );

        if (!isNew) {
          const { patient } = await getPatientByNumero(numero);
          if (!patient) {
            toast.warning("Patient introuvable");
            navigate("/medecin/patients");
            return;
          }

          const mapped = {
            id: patient.id,
            numero: patient.numero || "",
            name: patient.name || "",
            surname: patient.surname || "",
            birthdate: patient.birthdate ? patient.birthdate.split("T")[0] : "",
            gender: patient.gender || "",
            birth_address_id: patient.birth_address_id || null,
            birth_governorate: patient.birth_governorate || "",
            birth_postal_code_id: patient.birth_postal_code_id || "",
            residence_address_id: patient.residence_address_id || null,
            residence_governorate: patient.residence_governorate || "",
            residence_postal_code_id: patient.residence_postal_code_id || "",
            exact_address: patient.exact_address || "",
            phone: patient.phone || "",
            hospitalisation: patient.hospitalisation || "externe",
            doctor_id: patient.doctor_id || "",
            remarks: patient.remarks || "",
          };

          setFormData(mapped);
          setSavedFormData(mapped);
        } else {
          setSavedFormData(null);
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
        toast.error(err.response?.data?.message);
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

  // ====== State updaters ======
  const updateField = (name, value) => {
    const safeValue = sanitizeText(value);
    setFormData((prev) => {
      if (name === "birth_governorate") {
        return {
          ...prev,
          birth_governorate: safeValue,
          birth_postal_code_id: "",
        };
      }
      if (name === "residence_governorate") {
        return {
          ...prev,
          residence_governorate: safeValue,
          residence_postal_code_id: "",
        };
      }
      return {
        ...prev,
        [name]: safeValue,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // met à jour formData (ta logique existante)
    updateField(name, value);

    // supprime l'erreur du champ modifié (fonction autonome)
    clearFieldError(name, setErrors);
  };
  const handleNumeroChange = (e) => {
    const formatted = normalizeNumero(e.target.value);

    // Vérifie l’année si part2 complète
    const part2 = formatted.split("-")[1];
    if (part2 && part2.length === 4) {
      const currentYear = new Date().getFullYear();
      if (parseInt(part2, 10) > currentYear) {
        toast.error(`L'année doit être ≤ ${currentYear}`);
      }
    }

    setFormData((prev) => ({ ...prev, numero: formatted }));
  };
  const handleHospitalisationChange = (e) => {
    const hospitalisation = e.target.value;
    setFormData((prev) => {
      let numero = prev.numero || "";
      numero = numero.replace(/^F-/, "");
      if (hospitalisation === "externe" && numero) {
        numero = `F-${numero}`;
      }
      return { ...prev, hospitalisation, numero };
    });
  };

  // ====== Submit ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!isNew) {
        const confirmed = await confirmAction(
          "Enregistrer les modifications ?",
          "Les changements seront appliqués au dossier patient.",
        );
        if (!confirmed) {
          return;
        }
      }
      if (isNew) {
        const response = await createPatient(formData);
        toast.success("Patient créé avec succès");
        navigate(
          `/medecin/patient/${response.patient.numero}/workspace/profil`,
        );
      } else {
        const response = await updatePatient(formData.id, formData);
        const updatedPatient = response?.patient;
        toast.success("Patient mis à jour avec succès");
        setIsEditing(false);
        setSavedFormData(formData);
        navigate(`/medecin/patient/${updatedPatient.numero}/workspace/profil`, {
          replace: true,
        });
      }
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors)) {
        const formattedErrors = {};

        err.errors.forEach((e) => {
          formattedErrors[e.field] = e.message;
        });

        setErrors(formattedErrors);
        return;
      }

      toast.error(err?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  // ====== Annuler ======
  const handleCancel = () => {
    if (savedFormData) {
      setFormData(savedFormData);
    }
    setIsEditing(false);
  };

  return {
    // state
    formData,
    setFormData,
    setErrors,
    errors,
    isNew,
    isEditing,
    setIsEditing,
    loading,
    doctors,
    governorates,
    // derived
    filteredBirthPostalCodes,
    filteredResidencePostalCodes,
    canEditNumero,
    numeroHasError,
    // handlers
    handleChange,
    handleNumeroChange,
    handleHospitalisationChange,
    handleSubmit,
    handleCancel,
  };
}
