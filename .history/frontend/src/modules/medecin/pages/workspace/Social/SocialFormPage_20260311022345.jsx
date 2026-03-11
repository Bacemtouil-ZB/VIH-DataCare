import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SocialForm from "./SocialForm.jsx";
import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
import { getSocialByNumero, createSocial, updateSocial } from "../../../services/socialServices.jsx";
import { toast } from "react-toastify";

import {
  PROBLEME_OPTIONS,
  NIVEAU_ETUDE_OPTIONS,
  ACTIVITE_OPTIONS,
  SITUATION_SOCIAL_OPTIONS,
  INITIAL_SOCIAL_FORM_DATA,
} from "./socialForm.constants.js";

export default function SocialFormPage() {
  const { numero } = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_SOCIAL_FORM_DATA);

  // Charger les données
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

          setFormData({
            ...INITIAL_SOCIAL_FORM_DATA,
            situation_social: social.situation_social || "",
            niveau_etude: social.niveau_etude || "",
            nombre_enfants: social.nombre_enfants || 0,
            activite_professionnelle: social.activite_professionnelle || "",
            probleme: Array.isArray(problemeArray) ? problemeArray : [],
            remarque: social.remarque || "",
          });

          setIsEditing(true);
        } else {
          setIsEditing(false);
          setFormData(INITIAL_SOCIAL_FORM_DATA);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          setIsEditing(false);
          setFormData(INITIAL_SOCIAL_FORM_DATA);
        } else {
          console.error("Erreur chargement:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (numero) fetchData();
  }, [numero]);

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  // Soumission du formulaire
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

      if (isEditing) {
        const confirmed = await confirmAction(
          "Enregistrer les modifications ?",
          "Les changements seront appliqués au dossier patient.",
        );
        if (confirmed) {
          await updateSocial(numero, dataToSend);
          toast.success("Fiche sociale mise à jour avec succès !");
        }
      } else {
        await createSocial(numero, dataToSend);
        toast.success("Fiche sociale créée avec succès !");
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <div className="page-header">
        <h2>{isEditing ? "Fiche sociale" : "Nouvelle fiche sociale"}</h2>
      </div>

      <SocialForm
        formData={formData}
        handleChange={handleChange}
        handleProblemeChange={handleProblemeChange}
        handleSubmit={handleSubmit}
        isNew={!isEditing}
        problemeOptions={PROBLEME_OPTIONS}
        niveauEtudeOptions={NIVEAU_ETUDE_OPTIONS}
        activiteOptions={ACTIVITE_OPTIONS}
        situationSocialOptions={SITUATION_SOCIAL_OPTIONS}
      />
    </div>
  );
}