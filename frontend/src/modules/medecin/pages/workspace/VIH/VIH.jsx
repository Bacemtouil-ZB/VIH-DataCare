import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../../../shared/utils/api";
import VihForm from "../../../components/forms/vihForm";
import "./VihForm.css";

export default function VihPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [vihData, setVihData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Récupérer les données VIH existantes au chargement
  useEffect(() => {
    if (patientId) {
      fetchVihData();
    }
  }, [patientId]);

  /**
   * Récupère les données VIH du patient (en arrière-plan, ne bloque pas l'affichage)
   */
  const fetchVihData = async () => {
    try {
      const response = await API.get(`/api/vih/patient/${patientId}`);
      
      // Succès - données trouvées
      if (response.data && response.data.vih) {
        setVihData(response.data.vih);
      }
      
    } catch (error) {
      // ✅ Si 404 ou erreur, on affiche quand même le formulaire vide (mode création)
      console.log("Aucune donnée VIH trouvée, mode création activé");
      setVihData(null);
    }
  };

  /**
   * Gère la soumission du formulaire (création ou mise à jour)
   */
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setErrors({});
      setSuccessMessage("");
      setErrorMessage("");

      const isUpdate = vihData !== null;

      let response;

      if (isUpdate) {
        // Mise à jour - PUT /api/vih/update/:id
        response = await API.put(`/api/vih/update/${vihData.id}`, formData);
      } else {
        // Création - POST /api/vih/add avec patient_id dans le body
        response = await API.post("/api/vih/add", {
          ...formData,
          patient_id: parseInt(patientId)
        });
      }

      // Succès
      setSuccessMessage(
        isUpdate
          ? "Fiche VIH mise à jour avec succès"
          : "Fiche VIH créée avec succès"
      );

      // Recharger les données
      await fetchVihData();

      // Faire défiler vers le haut pour voir le message
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      console.error("Erreur:", error);

      // Gérer les erreurs de validation
      if (error.response?.data?.errors) {
        const errorObj = {};
        error.response.data.errors.forEach((err) => {
          errorObj[err.field] = err.message;
        });
        setErrors(errorObj);
      } else {
        setErrorMessage(
          error.response?.data?.message || 
          "Une erreur s'est produite lors de l'enregistrement"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Supprime la fiche VIH (admin uniquement)
   */
  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette fiche VIH ?")) {
      return;
    }

    try {
      setIsLoading(true);

      await API.delete(`/api/vih/${vihData.id}`);

      setSuccessMessage("Fiche VIH supprimée avec succès");

      // Rediriger après 1 seconde
      setTimeout(() => {
        navigate(-1);
      }, 1000);

    } catch (error) {
      console.error("Erreur:", error);
      setErrorMessage(
        error.response?.data?.message || 
        "Une erreur s'est produite lors de la suppression"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ CHANGEMENT : Afficher immédiatement le formulaire, pas de loading
  return (
    <div className="medical-page">
      
      {/* En-tête de la page */}
      <div className="page-header">
        <div>
          <h2>Fiche VIH du patient</h2>
          {vihData && (
            <p className="subtitle">
              Dernière modification : {new Date(vihData.updated_at).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
        
        {/* Boutons d'action */}
        <div className="header-actions">          
          {vihData && (
            <button 
              onClick={handleDelete}
              className="btn-danger"
              disabled={isLoading}
            >
              🗑️ Supprimer
            </button>
          )}
        </div>
      </div>

      {/* Messages de succès */}
      {successMessage && (
        <div className="alert alert-success">
          <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Messages d'erreur */}
      {errorMessage && (
        <div className="alert alert-error">
          <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* Info mode création/édition */}
      {!vihData && (
        <div className="alert alert-info">
          <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Aucune fiche VIH trouvée pour ce patient. Créez-en une nouvelle ci-dessous.
        </div>
      )}

      {/* ✅ Formulaire VIH - Toujours affiché */}
      <VihForm
        initialData={vihData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errors={errors}
      />

    </div>
  );
}