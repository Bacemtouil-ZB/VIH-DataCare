import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import {
  getSocialByNumero,
  createSocial,
  updateSocial,
} from "../../../services/socialServices.jsx";
import { INITIAL_SOCIAL_FORM_DATA } from "./socialForm.constants.js";
import { clearFieldError } from "../../../shared/utils/clearFieldError.js";

export function useSocialLogic() {
  const { numero } = useParams();
  const [loading, setLoading] = useState(true);
  const [ficheExists, setFicheExists] = useState(false); // ← fiche existe en DB
  const [isEditing, setIsEditing] = useState(false); // ← mode modification UI
  const [formData, setFormData] = useState(INITIAL_SOCIAL_FORM_DATA);
  const [savedFormData, setSavedFormData] = useState(INITIAL_SOCIAL_FORM_DATA);
  const [errors, setErrors] = useState({});

  // ====== Chargement initial ======
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const social = await getSocialByNumero(numero);

        if (social && social.id) {
          let problemeArray = social.probleme || [];
          if (typeof problemeArray === "string") {
            try {
              problemeArray = JSON.parse(problemeArray);
            } catch {
              problemeArray = [];
            }
          }

          const mapped = {
            ...INITIAL_SOCIAL_FORM_DATA,
            situation_social: social.situation_social || "",
            niveau_etude: social.niveau_etude || "",
            nombre_enfants: social.nombre_enfants || 0,
            activite_professionnelle: social.activite_professionnelle || "",
            probleme: Array.isArray(problemeArray) ? problemeArray : [],
            remarque: social.remarque || "",
          };

          setFormData(mapped);
          setSavedFormData(mapped);
          setFicheExists(true); // ← fiche trouvée
          setIsEditing(false); // ← mode lecture par défaut
        } else {
          setFicheExists(false); // ← nouvelle fiche
          setIsEditing(true); // ← mode saisie direct
          setFormData(INITIAL_SOCIAL_FORM_DATA);
          setSavedFormData(INITIAL_SOCIAL_FORM_DATA);
        }
      } catch (error) {
        console.error("Erreur inattendue:", error);
      } finally {
        setLoading(false);
      }
    };

    if (numero) fetchData();
  }, [numero]);

  // ====== Handlers ======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name, setErrors);
  };

  const handleProblemeChange = (option, checked) => {
    setFormData((prev) => {
      let arr = Array.isArray(prev.probleme) ? [...prev.probleme] : [];
      if (checked) {
        if (!arr.includes(option)) arr.push(option);
      } else {
        arr = arr.filter((p) => p !== option);
      }
      return { ...prev, probleme: arr };
    });
  };

  // ====== Submit ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        situation_social: formData.situation_social || null,
        niveau_etude: formData.niveau_etude || null,
        nombre_enfants: parseInt(formData.nombre_enfants) || 0,
        activite_professionnelle: formData.activite_professionnelle || null,
        probleme: Array.isArray(formData.probleme) ? formData.probleme : [],
        remarque: formData.remarque || null,
      };

      if (ficheExists) {
        const confirmed = await confirmAction(
          "Enregistrer les modifications ?",
          "Les changements seront appliqués au dossier patient.",
        );
        if (confirmed) {
          await updateSocial(numero, dataToSend);
          toast.success("Fiche sociale mise à jour avec succès !");
          setSavedFormData(formData);
          setIsEditing(false); // ← seulement après succès
        }
      } else {
        await createSocial(numero, dataToSend);
        toast.success("Fiche sociale créée avec succès !");
        setSavedFormData(formData);
        setFicheExists(true);
        setIsEditing(false); // ← seulement après succès
      }
    } catch (error) {
      if (error?.errors && Array.isArray(error.errors)) {
        const formattedErrors = {};
        error.errors.forEach((e) => {
          formattedErrors[e.field] = e.message;
        });
        setErrors(formattedErrors);
        return; // stopper ici pour ne pas afficher toast général
      }

      toast.error(error?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  // ====== Annuler ======
  const handleCancel = () => {
    setFormData(savedFormData);
    if (ficheExists) {
      setIsEditing(false); // ← ferme seulement si fiche existe
    }
  };

  return {
    formData,
    ficheExists,
    isEditing,
    setIsEditing,
    loading,
    handleChange,
    handleProblemeChange,
    handleSubmit,
    handleCancel,
    errors,
    setErrors,
  };
}
