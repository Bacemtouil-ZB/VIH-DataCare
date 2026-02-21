import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SocialForm from "../../../components/forms/SocialForm.jsx";
import {
  getSocialByNumero,
  createSocial,
  updateSocial,
} from "../../../services/socialServices.jsx";

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
    { value: "universite", label: "Université" },
  ];


  const activiteOptions = [
    { value: "etudiant", label: "Étudiant(e)" },
    { value: "salarie", label: "Salarié(e)" },
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
      console.log("Données sociales récupérées:", social);
      if (social !== null && social !== undefined) {
        console.log("Fiche sociale trouvée:", social);
        // Parser probleme si c'est une chaîne JSON
        let problemeArray = social.probleme || [];
        if (typeof problemeArray === 'string') {
          try {
            problemeArray = JSON.parse(problemeArray);
          } catch (err) {
            err.problemeArray = [];
          }
        }
        
        setFormData({
          situation_social: social.situation_social || "",
          niveau_etude: social.niveau_etude || "",
          nombre_enfants: social.nombre_enfants || 0,
          activite_professionnelle: social.activite_professionnelle || "",
          probleme: Array.isArray(problemeArray) ? problemeArray : [],
          remarque: social.remarque || "",
        });
        setIsEditing(true);
      } else {
         setFormData({
          situation_social: "",
          niveau_etude: "",
          nombre_enfants: 0,
          activite_professionnelle: "",
          probleme: [],
          remarque: "",
        });
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
        activite_professionnelle: formData.activite_professionnelle || null,
        probleme: Array.isArray(formData.probleme)
          ? formData.probleme
          : [],
        remarque: formData.remarque || null,
      };
console.log("isEditing value:", isEditing);
      if ( isEditing === true) {
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
     
        <SocialForm
          formData={formData}
          handleChange={handleChange}
          handleProblemeChange={handleProblemeChange}
          handleSubmit={handleSubmit}
          isEditing={isEditing}
          problemeOptions={problemeOptions}
          niveauEtudeOptions={niveauEtudeOptions}
          activiteOptions={activiteOptions}
          situationSocialOptions={situationSocialOptions}
        />
     
    </div>
  );
}