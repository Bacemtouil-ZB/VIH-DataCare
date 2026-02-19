import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SocialForm from "../../../components/forms/SocialForm.jsx";
import {
  getSocialByNumero,
  createSocial,
  updateSocial,
} from "../../../services/socialServices.jsx";
import "./SocialForm.css";

export default function SocialFormPage() {
  const { numero } = useParams();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    situation_social: "",
    niveau_etude: "",
    nombre_enfants: 0,
    type_ressource: "",
    activite_professionnelle: "",
    probleme: [],
    remarque: "",
  });

  // Options
  const problemeOptions = [
    { value: "precarite_logement", label: "Précarité logement" },
    { value: "instabilite_professionnelle", label: "Instabilité professionnelle" },
    { value: "difficultes_financieres", label: "Difficultés financières" },
    { value: "conflits_familiaux", label: "Conflits familiaux" },
    { value: "isolement_social", label: "Isolement social" },
    { value: "violence_domestique", label: "Violence domestique" },
    { value: "problemes_transport", label: "Problèmes transport" },
    { value: "difficulte_acces_soins", label: "Difficulté accès soins" },
  ];

  const niveauEtudeOptions = [
    { value: "sans_instruction", label: "Sans instruction" },
    { value: "primaire", label: "Primaire" },
    { value: "secondaire", label: "Secondaire" },
    { value: "formation_professionnelle", label: "Formation professionnelle" },
    { value: "baccalaureat", label: "Baccalauréat" },
    { value: "licence", label: "Licence" },
    { value: "master", label: "Master" },
    { value: "doctorat", label: "Doctorat" },
  ];

  const ressourcesOptions = [
    { value: "salaire", label: "Salaire" },
    { value: "revenu_independant", label: "Revenu indépendant" },
    { value: "aide_sociale", label: "Aide sociale" },
    { value: "allocation_familiale", label: "Allocation familiale" },
    { value: "pension_retraite", label: "Pension retraite" },
    { value: "soutien_familial", label: "Soutien familial" },
    { value: "aucune_ressource", label: "Aucune ressource" },
  ];

  const activiteOptions = [
    { value: "etudiant", label: "Étudiant(e)" },
    { value: "salarie_public", label: "Salarié(e) secteur public" },
    { value: "salarie_prive", label: "Salarié(e) secteur privé" },
    { value: "travailleur_independant", label: "Travailleur indépendant" },
    { value: "profession_liberale", label: "Profession libérale" },
    { value: "artisan", label: "Artisan" },
    { value: "commercant", label: "Commerçant" },
    { value: "agriculteur", label: "Agriculteur" },
    { value: "sans_emploi", label: "Sans emploi" },
    { value: "retraite", label: "Retraité(e)" },
    { value: "personne_au_foyer", label: "Personne au foyer" },
  ];

  const situationSocialOptions = [
    { value: "celibataire", label: "Célibataire" },
    { value: "marie", label: "Marié(e)" },
    { value: "divorce", label: "Divorcé(e)" },
    { value: "veuf", label: "Veuf(ve)" },
    { value: "autre", label: "Autre" },
  ];

  // Charger les données
 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const social = await getSocialByNumero(numero);
      if (social) {
        // Parser probleme si c'est une chaîne JSON
        let problemeArray = social.probleme || [];
        if (typeof problemeArray === 'string') {
          try {
            problemeArray = JSON.parse(problemeArray);
          } catch (e) {
            e.problemeArray = [];
          }
        }
        
        setFormData({
          situation_social: social.situation_social || "",
          niveau_etude: social.niveau_etude || "",
          nombre_enfants: social.nombre_enfants || 0,
          type_ressource: social.type_ressource || "",
          activite_professionnelle: social.activite_professionnelle || "",
          probleme: Array.isArray(problemeArray) ? problemeArray : [],
          remarque: social.remarque || "",
        });
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  if (numero) {
    fetchData();
  }
}, [numero]);

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProblemeChange = (option, checked) => {
  setFormData((prev) => {
    // Assurez-vous que probleme est toujours un tableau propre
    let arr = Array.isArray(prev.probleme) ? [...prev.probleme] : [];
    
    if (checked) {
      // Ajouter seulement si pas déjà présent
      if (!arr.includes(option)) {
        arr.push(option);
      }
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
        type_ressource: formData.type_ressource || null,
        activite_professionnelle: formData.activite_professionnelle || null,
        probleme: Array.isArray(formData.probleme)
          ? formData.probleme
          : [],
        remarque: formData.remarque || null,
      };

      if (isEditing) {
        await updateSocial(numero, dataToSend);
        alert("Fiche sociale mise à jour avec succès !");
      } else {
        await createSocial(numero, dataToSend);
        alert("Fiche sociale créée avec succès !");
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="medical-page">
      <div className="page-header">
        <h2>{isEditing ? "Fiche sociale" : "Nouvelle fiche sociale"}</h2>
      </div>
      <div className="form-card">
        <SocialForm
          formData={formData}
          handleChange={handleChange}
          handleProblemeChange={handleProblemeChange}
          handleSubmit={handleSubmit}
          isEditing={true}
          problemeOptions={problemeOptions}
          niveauEtudeOptions={niveauEtudeOptions}
          activiteOptions={activiteOptions}
          ressourcesOptions={ressourcesOptions}
          situationSocialOptions={situationSocialOptions}
        />
      </div>
    </div>
  );
}