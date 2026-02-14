import { useState, useEffect } from "react";

// Listes de valeurs pour les dropdowns
const MODES_CONTAMINATION = [
  "A.E.S",
  "Homosexuel",
  "Bisexuel",
  "Hémophile",
  "Hétérosexuel",
  "Mère/Nouveau-né",
  "Toxicomanie IV",
  "Transfusion",
  "Hémophilie",
  "Inconnu",
  "Autre"
];

const TYPES_DEPISTAGE = [
  "Trod",
  "Elisa",
  "Autres"
];

const CIRCONSTANCES_DECOUVERTE = [
  "Proposition d'une association",
  "Proposition à l'initiative du patient",
  "Proposition du médecin",
  "Demande du patient",
  "Autres circonstances"
];

const STADES_CDC = [
  "A0", "A1", "A2", "A3",
  "B0", "B1", "B2", "B3",
  "C0", "C1", "C2", "C3"
];

export default function VihForm({ 
  initialData = null, 
  onSubmit, 
  isLoading = false,
  errors = {} 
}) {
  const [formData, setFormData] = useState({
    mode_contamination: "",
    type_depistage: "",
    circonstance_decouverte: "",
    date_derniere_negative: "",
    date_contamination: "",
    date_vih_positif: "",
    stade_cdc: "",
    debut_stade_c: "",
    typage_hla_b5701: "",
    profil_seroconversion: false,
  });

  // Charger les données initiales si elles existent (mode édition)
  useEffect(() => {
    if (initialData) {
      setFormData({
        mode_contamination: initialData.mode_contamination || "",
        type_depistage: initialData.type_depistage || "",
        circonstance_decouverte: initialData.circonstance_decouverte || "",
        date_derniere_negative: initialData.date_derniere_negative || "",
        date_contamination: initialData.date_contamination || "",
        date_vih_positif: initialData.date_vih_positif || "",
        stade_cdc: initialData.stade_cdc || "",
        debut_stade_c: initialData.debut_stade_c || "",
        typage_hla_b5701: initialData.typage_hla_b5701 || "",
        profil_seroconversion: initialData.profil_seroconversion || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };

      // Si le stade CDC change et n'est pas un stade C, réinitialiser debut_stade_c
      if (name === "stade_cdc" && !value.startsWith("C")) {
        newData.debut_stade_c = "";
      }

      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Vérifier si le stade C est sélectionné pour afficher le champ date
  const isStadeC = formData.stade_cdc.startsWith("C");

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid">

        {/* Mode de contamination - Dropdown */}
        <div className="form-group">
          <label htmlFor="mode_contamination">
            Mode de contamination
          </label>
          <select
            id="mode_contamination"
            name="mode_contamination"
            value={formData.mode_contamination}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.mode_contamination ? "error" : ""}
          >
            <option value="">-- Sélectionner --</option>
            {MODES_CONTAMINATION.map(mode => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          {errors.mode_contamination && (
            <span className="error-message">{errors.mode_contamination}</span>
          )}
        </div>

        {/* Type de dépistage - Dropdown */}
        <div className="form-group">
          <label htmlFor="type_depistage">
            Type de dépistage
          </label>
          <select
            id="type_depistage"
            name="type_depistage"
            value={formData.type_depistage}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.type_depistage ? "error" : ""}
          >
            <option value="">-- Sélectionner --</option>
            {TYPES_DEPISTAGE.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type_depistage && (
            <span className="error-message">{errors.type_depistage}</span>
          )}
        </div>

        {/* Circonstance de découverte - Dropdown (full width) */}
        <div className="form-group full-width">
          <label htmlFor="circonstance_decouverte">
            Circonstance de découverte
          </label>
          <select
            id="circonstance_decouverte"
            name="circonstance_decouverte"
            value={formData.circonstance_decouverte}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.circonstance_decouverte ? "error" : ""}
          >
            <option value="">-- Sélectionner --</option>
            {CIRCONSTANCES_DECOUVERTE.map(circonstance => (
              <option key={circonstance} value={circonstance}>
                {circonstance}
              </option>
            ))}
          </select>
          {errors.circonstance_decouverte && (
            <span className="error-message">{errors.circonstance_decouverte}</span>
          )}
        </div>

        {/* Date dernière négative */}
        <div className="form-group">
          <label htmlFor="date_derniere_negative">
            Date dernière négative
          </label>
          <input
            type="date"
            id="date_derniere_negative"
            name="date_derniere_negative"
            value={formData.date_derniere_negative}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.date_derniere_negative ? "error" : ""}
          />
          {errors.date_derniere_negative && (
            <span className="error-message">{errors.date_derniere_negative}</span>
          )}
        </div>

        {/* Date de contamination */}
        <div className="form-group">
          <label htmlFor="date_contamination">
            Date de contamination
          </label>
          <input
            type="date"
            id="date_contamination"
            name="date_contamination"
            value={formData.date_contamination}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.date_contamination ? "error" : ""}
          />
          {errors.date_contamination && (
            <span className="error-message">{errors.date_contamination}</span>
          )}
        </div>

        {/* Date VIH positif */}
        <div className="form-group">
          <label htmlFor="date_vih_positif">
            Date VIH positif
          </label>
          <input
            type="date"
            id="date_vih_positif"
            name="date_vih_positif"
            value={formData.date_vih_positif}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.date_vih_positif ? "error" : ""}
          />
          {errors.date_vih_positif && (
            <span className="error-message">{errors.date_vih_positif}</span>
          )}
        </div>

        {/* Stade CDC - Dropdown */}
        <div className="form-group">
          <label htmlFor="stade_cdc">
            Stade CDC
          </label>
          <select
            id="stade_cdc"
            name="stade_cdc"
            value={formData.stade_cdc}
            onChange={handleChange}
            disabled={isLoading}
            className={errors.stade_cdc ? "error" : ""}
          >
            <option value="">-- Sélectionner --</option>
            {STADES_CDC.map(stade => (
              <option key={stade} value={stade}>
                {stade}
              </option>
            ))}
          </select>
          {errors.stade_cdc && (
            <span className="error-message">{errors.stade_cdc}</span>
          )}
        </div>

        {/* Début stade C - Affiché uniquement si stade C sélectionné */}
        {isStadeC && (
          <div className="form-group">
            <label htmlFor="debut_stade_c">
              Début stade C
            </label>
            <input
              type="date"
              id="debut_stade_c"
              name="debut_stade_c"
              value={formData.debut_stade_c}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.debut_stade_c ? "error" : ""}
            />
            {errors.debut_stade_c && (
              <span className="error-message">{errors.debut_stade_c}</span>
            )}
          </div>
        )}

        {/* Typage HLA-B5701 - Radio buttons */}
        <div className="form-group">
          <label>Typage HLA-B5701</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="typage_hla_b5701"
                value="Positif"
                checked={formData.typage_hla_b5701 === "Positif"}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span>Positif</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="typage_hla_b5701"
                value="Négatif"
                checked={formData.typage_hla_b5701 === "Négatif"}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span>Négatif</span>
            </label>
          </div>
          {errors.typage_hla_b5701 && (
            <span className="error-message">{errors.typage_hla_b5701}</span>
          )}
        </div>

        {/* Profil de séroconversion - Radio buttons */}
        <div className="form-group">
          <label>Profil de séroconversion (Fiebig I à V)</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="profil_seroconversion"
                checked={formData.profil_seroconversion === true}
                onChange={() => setFormData(prev => ({ ...prev, profil_seroconversion: true }))}
                disabled={isLoading}
              />
              <span>Oui</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="profil_seroconversion"
                checked={formData.profil_seroconversion === false}
                onChange={() => setFormData(prev => ({ ...prev, profil_seroconversion: false }))}
                disabled={isLoading}
              />
              <span>Non</span>
            </label>
          </div>
          {errors.profil_seroconversion && (
            <span className="error-message">{errors.profil_seroconversion}</span>
          )}
        </div>

        {/* Bouton de soumission */}
        <div className="form-group full-width">
          <button 
            type="submit" 
            className="save-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Enregistrement...
              </>
            ) : (
              initialData ? "Mettre à jour la fiche VIH" : "Enregistrer la fiche VIH"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}