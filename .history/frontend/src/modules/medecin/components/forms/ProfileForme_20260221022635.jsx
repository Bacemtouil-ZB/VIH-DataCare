// import "./ProfilForme.css";
// export default function ProfilForm({
//   formData,
//   setFormData,
//   onSubmit,
//   isNew,
//   isEditing,
//   setIsEditing,
//   onCancel,
//   doctors = [],
//   formDataOptions = { governorates: [], postalCodes: [] }
// }) {

//   const { governorates, postalCodes } = formDataOptions;

//   /* ------------------ HANDLE CHANGE ------------------ */
//   const handleChange = (e) => {
//     let { name, value } = e.target;

//     if (typeof value === "string") {
//       value = value.replace(/[<>]/g, "");
//     }

//     setFormData(prev => {
//       if (name === "birth_governorate") {
//         return { ...prev, birth_governorate: value, birth_postal_code_id: "" };
//       }
//       if (name === "residence_governorate") {
//         return { ...prev, residence_governorate: value, residence_postal_code_id: "" };
//       }
//       return { ...prev, [name]: value };
//     });
//   };

//   /* ------------------ FILTRES ------------------ */
//   // birth_governorate et residence_governorate stockent le NAME du gouvernorat
//  const filteredBirthPostalCodes = postalCodes.filter(
//   pc => pc.governorate === formData.birth_governorate
// );

// const filteredResidencePostalCodes = postalCodes.filter(
//   pc => pc.governorate === formData.residence_governorate
// );
//   return (
//     <div className="form-card">
//       <form onSubmit={onSubmit} className="form-grid">

//         {/* Numéro dossier */}
//         <div className="form-group">
//           <label>Numéro dossier</label>
//           <input
//             name="numero"
//             value={formData.numero || ""}
//             onChange={handleChange}
//             disabled={!isNew}
//             required
//           />
//         </div>

//         {/* Hospitalisation */}
//         <div className="form-group">
//           <label>Hospitalisation</label>
//           <select
//             name="hospitalisation"
//             value={formData.hospitalisation || "externe"}
//             onChange={handleChange}
//             disabled={!isEditing}
//           >
//             <option value="externe">Externe</option>
//             <option value="interne">Interne</option>
//           </select>
//         </div>

//         {/* Nom */}
//         <div className="form-group">
//           <label>Nom</label>
//           <input
//             name="name"
//             value={formData.name || ""}
//             onChange={handleChange}
//             pattern="[A-Za-zÀ-ÿ\s]+"
//             disabled={!isEditing}
//             required
//           />
//         </div>

//         {/* Prénom */}
//         <div className="form-group">
//           <label>Prénom</label>
//           <input
//             name="surname"
//             value={formData.surname || ""}
//             onChange={handleChange}
//             pattern="[A-Za-zÀ-ÿ\s]+"
//             disabled={!isEditing}
//             required
//           />
//         </div>

//         {/* Date naissance */}
//         <div className="form-group">
//           <label>Date de naissance</label>
//           <input
//             type="date"
//             name="birthdate"
//             value={formData.birthdate || ""}
//             onChange={handleChange}
//             max={new Date().toISOString().split("T")[0]}
//             disabled={!isEditing}
//             required
//           />
//         </div>

//         {/* Sexe */}
//         <div className="form-group">
//           <label>Sexe</label>
//           <div className="radio-group">
//             <label>
//               <input
//                 type="radio"
//                 name="gender"
//                 value="homme"
//                 checked={formData.gender === "homme"}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//               />
//               Homme
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="gender"
//                 value="femme"
//                 checked={formData.gender === "femme"}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//               />
//               Femme
//             </label>
//           </div>
//         </div>

//         {/* Téléphone */}
//         <div className="form-group">
//           <label>Téléphone</label>
//           <input
//             name="phone"
//             value={formData.phone || ""}
//             onChange={handleChange}
//             pattern="^[24597][0-9]{7}$"
//             title="Numéro tunisien invalide (ex: 20123456)"
//             disabled={!isEditing}
//             required
//           />
//         </div>

//         {/* Gouvernorat naissance */}
//         <div className="form-group">
//           <label>Gouvernorat naissance</label>
//           <select
//             name="birth_governorate"
//             value={formData.birth_governorate || ""}
//             onChange={handleChange}
//             disabled={!isEditing}
//             required
//           >
//             <option value="">Sélectionner</option>
//             {governorates.map((g) => (
//               <option key={g.id} value={g.name}>{g.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Code postal naissance */}
//         <div className="form-group">
//           <label>Code postal naissance</label>
//           <select
//             name="birth_postal_code_id"
//             value={formData.birth_postal_code_id || ""}
//             onChange={handleChange}
//             disabled={!isEditing || !formData.birth_governorate}
//             required
//           >
//             <option value="">
//               {formData.birth_governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat"}
//             </option>
//             {filteredBirthPostalCodes.map((pc) => (
//               <option key={pc.id} value={pc.id}>{pc.code_postal}</option>
//             ))}
//           </select>
//         </div>

//         {/* Gouvernorat résidence */}
//         <div className="form-group">
//           <label>Gouvernorat résidence</label>
//           <select
//             name="residence_governorate"
//             value={formData.residence_governorate || ""}
//             onChange={handleChange}
//             disabled={!isEditing}
//             required
//           >
//             <option value="">Sélectionner</option>
//             {governorates.map((g) => (
//               <option key={g.id} value={g.name}>{g.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Code postal résidence */}
//         <div className="form-group">
//           <label>Code postal résidence</label>
//           <select
//             name="residence_postal_code_id"
//             value={formData.residence_postal_code_id || ""}
//             onChange={handleChange}
//             disabled={!isEditing || !formData.residence_governorate}
//             required
//           >
//             <option value="">
//               {formData.residence_governorate ? "Sélectionner" : "Choisir d'abord un gouvernorat"}
//             </option>
//             {filteredResidencePostalCodes.map((pc) => (
//               <option key={pc.id} value={pc.id}>{pc.code_postal}</option>
//             ))}
//           </select>
//         </div>

//         {/* Médecin */}
//         <div className="form-group">
//           <label>Médecin traitant</label>
//           <select
//             name="doctor_id"
//             value={formData.doctor_id || ""}
//             onChange={handleChange}
//             disabled={!isEditing}
//           >
//             <option value="">Sélectionner</option>
//             {doctors.map((doc) => (
//               <option key={doc.id} value={doc.id}>
//                 {doc.nom} {doc.prenom}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Remarques */}
//         <div className="form-group full-width">
//           <label>Remarques</label>
//           <textarea
//             name="remarks"
//             value={formData.remarks || ""}
//             onChange={handleChange}
//             disabled={!isEditing}
//           />
//         </div>

//         {/* Actions */}
//         <div className="form-group full-width">
//           {!isEditing ? (
//             <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
//               Modifier
//             </button>
//           ) : (
//             <div className="edit-actions">
//               <button type="submit" className="save-btn">
//                 {isNew ? "Créer" : "Enregistrer"}
//               </button>
//               {!isNew && (
//                 <button type="button" className="cancel-btn" onClick={onCancel}>
//                   Annuler
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//       </form>
//     </div>
//   );
// }

import "./ProfilForme.css";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export default function ProfilForm({
  formData,
  setFormData,
  onSubmit,
  isNew,
  isEditing,
  setIsEditing,
  onCancel,
  doctors = [],
  formDataOptions = { governorates: [], postalCodes: [] }
}) {
  const { governorates, postalCodes } = formDataOptions;

  const [errors, setErrors] = useState({}); // pour validation inline

  /* ------------------ FILTRES ------------------ */
  const filteredBirthPostalCodes = postalCodes.filter(pc => pc.governorate === formData.birth_governorate);
  const filteredResidencePostalCodes = postalCodes.filter(pc => pc.governorate === formData.residence_governorate);

  /* ------------------ HANDLE CHANGE ------------------ */
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Nettoyage rapide pour éviter < et >
    if (typeof value === "string") {
      value = value.replace(/[<>]/g, "");
    }

    setFormData(prev => {
      // reset code postal si gouvernorat change
      if (name === "birth_governorate") return { ...prev, birth_governorate: value, birth_postal_code_id: "" };
      if (name === "residence_governorate") return { ...prev, residence_governorate: value, residence_postal_code_id: "" };
      return { ...prev, [name]: value };
    });

    // Validation instantanée
    validateField(name, value);
  };

  /* ------------------ VALIDATION CHAMP PAR CHAMP ------------------ */
  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "numero":
        if (!value?.trim()) message = "Le numéro de dossier est obligatoire.";
        break;
      case "name":
      case "surname":
        if (!value?.trim()) message = "Ce champ est obligatoire.";
        else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(value)) message = "Caractères invalides.";
        break;
      case "birthdate":
        if (!value) message = "La date de naissance est obligatoire.";
        else if (new Date(value) > new Date()) message = "La date ne peut pas être future.";
        break;
      case "gender":
        if (!["homme", "femme"].includes(value)) message = "Veuillez sélectionner le sexe.";
        break;
      case "phone":
        if (!/^[24597][0-9]{7}$/.test(value)) message = "Numéro tunisien invalide.";
        break;
      case "birth_governorate":
        if (!value) message = "Sélectionner un gouvernorat.";
        break;
      case "birth_postal_code_id":
        if (!value) message = "Sélectionner un code postal.";
        break;
      case "residence_governorate":
        if (!value) message = "Sélectionner un gouvernorat.";
        break;
      case "residence_postal_code_id":
        if (!value) message = "Sélectionner un code postal.";
        break;
      case "doctor_id":
        if (!value) message = "Sélectionner un médecin.";
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: message }));
  };

  /* ------------------ VALIDATION GLOBALE ------------------ */
  const validateForm = () => {
    const fields = [
      "numero","name","surname","birthdate","gender",
      "phone","birth_governorate","birth_postal_code_id",
      "residence_governorate","residence_postal_code_id","doctor_id"
    ];

    let isValid = true;
    fields.forEach(f => {
      const value = formData[f];
      validateField(f, value);
      if (!value || errors[f]) isValid = false;
    });

    if (!isValid) toast.error("Corrigez les erreurs avant de soumettre !");
    return isValid;
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(e);
  };

  /* ------------------ RENDER SELECT AVEC ERREURS ------------------ */
  const renderSelect = (name, value, options, placeholder, disabled, displayFn) => (
    <>
      <select
        name={name}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        className={errors[name] ? "error-input" : ""}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {displayFn ? displayFn(opt) : opt.name || opt.code_postal || `${opt.nom} ${opt.prenom}`}
          </option>
        ))}
      </select>
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </>
  );

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="form-grid">

        {/* Exemple : numéro */}
        <div className="form-group">
          <label>Numéro dossier</label>
          <input
            name="numero"
            value={formData.numero || ""}
            onChange={handleChange}
            disabled={!isNew}
            className={errors.numero ? "error-input" : ""}
            required
          />
          {errors.numero && <span className="error-text">{errors.numero}</span>}
        </div>

        {/* Nom */}
        <div className="form-group">
          <label>Nom</label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.name ? "error-input" : ""}
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Gouvernorat naissance */}
        <div className="form-group">
          <label>Gouvernorat naissance</label>
          {renderSelect(
            "birth_governorate",
            formData.birth_governorate,
            governorates,
            "Sélectionner",
            !isEditing
          )}
        </div>

        {/* Code postal naissance */}
        <div className="form-group">
          <label>Code postal naissance</label>
          {renderSelect(
            "birth_postal_code_id",
            formData.birth_postal_code_id,
            filteredBirthPostalCodes,
            formData.birth_governorate ? "Sélectionner" : "Choisir un gouvernorat",
            !isEditing || !formData.birth_governorate,
            (opt) => opt.code
          )}
        </div>

        {/* Gouvernorat résidence */}
        <div className="form-group">
          <label>Gouvernorat résidence</label>
          {renderSelect(
            "residence_governorate",
            formData.residence_governorate,
            governorates,
            "Sélectionner",
            !isEditing
          )}
        </div>

        {/* Code postal résidence */}
        <div className="form-group">
          <label>Code postal résidence</label>
          {renderSelect(
            "residence_postal_code_id",
            formData.residence_postal_code_id,
            filteredResidencePostalCodes,
            formData.residence_governorate ? "Sélectionner" : "Choisir un gouvernorat",
            !isEditing || !formData.residence_governorate,
            (opt) => opt.code
          )}
        </div>

        {/* Médecin */}
        <div className="form-group">
          <label>Médecin traitant</label>
          {renderSelect(
            "doctor_id",
            formData.doctor_id,
            doctors,
            "Sélectionner",
            !isEditing,
            (opt) => `${opt.nom} ${opt.prenom}`
          )}
        </div>

        {/* Actions */}
        <div className="form-group full-width">
          {!isEditing ? (
            <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>Modifier</button>
          ) : (
            <div className="edit-actions">
              <button type="submit" className="save-btn">{isNew ? "Créer" : "Enregistrer"}</button>
              {!isNew && <button type="button" className="cancel-btn" onClick={onCancel}>Annuler</button>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}