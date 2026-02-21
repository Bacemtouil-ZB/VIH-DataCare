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
    activite_professionnelle: "",
    probleme: [],
    remarque: "",
  });

  // ================================
  // CHARGEMENT DES DONNÉES
  // ================================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const social = await getSocialByNumero(numero);

        // Si backend retourne bien un objet valide
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
            situation_social: social.situation_social || "",
            niveau_etude: social.niveau_etude || "",
            nombre_enfants: social.nombre_enfants || 0,
            activite_professionnelle:
              social.activite_professionnelle || "",
            probleme: Array.isArray(problemeArray)
              ? problemeArray
              : [],
            remarque: social.remarque || "",
          });

          setIsEditing(true); // 👉 MODE UPDATE
        } else {
          setIsEditing(false); // 👉 MODE CREATE
        }
      } catch (error) {
        // Si 404 → fiche n'existe pas
        if (error.response?.status === 404) {
          setIsEditing(false);
        } else {
          console.error("Erreur chargement fiche sociale :", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (numero) {
      fetchData();
    }
  }, [numero]);

  // ================================
  // HANDLE CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProblemeChange = (option, checked) => {
    setFormData((prev) => {
      let arr = Array.isArray(prev.probleme)
        ? [...prev.probleme]
        : [];

      if (checked) {
        if (!arr.includes(option)) {
          arr.push(option);
        }
      } else {
        arr = arr.filter((p) => p !== option);
      }

      return { ...prev, probleme: arr };
    });
  };

  // ================================
  // SUBMIT
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        situation_social: formData.situation_social || null,
        niveau_etude: formData.niveau_etude || null,
        nombre_enfants: parseInt(formData.nombre_enfants) || 0,
        activite_professionnelle:
          formData.activite_professionnelle || null,
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
        setIsEditing(true); // après création → devient update
      }
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
      alert(
        error.response?.data?.message ||
          "Erreur lors de l'enregistrement"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <div className="page-header">
        <h2>
          {isEditing
            ? "Fiche sociale"
            : "Nouvelle fiche sociale"}
        </h2>
      </div>

      <SocialForm
        formData={formData}
        handleChange={handleChange}
        handleProblemeChange={handleProblemeChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
      />
    </div>
  );
}