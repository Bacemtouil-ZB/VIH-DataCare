// import React, { useState, useEffect } from "react";
// import "./SocialForm.css";
// import ToggleSwitch from "../../../components/buttons/ToggleSwitch.jsx";
// import { confirmAction } from "../../../../../shared/utils/uiAlerts.js";
// import {toast} from "react-toastify";
// import FieldLabel from "../../../components/UI/FieldLabel";

// export default function SocialForm({
//   formData,
//   handleChange,
//   handleProblemeChange,
//   handleSubmit,
//   problemeOptions,
//   niveauEtudeOptions,
//   activiteOptions,
//   situationSocialOptions,
//   isNew,       // pour savoir si c'est une nouvelle fiche
//   onCancel,    // callback optionnel pour annuler
// }) {
//   const [isEditing, setIsEditing] = useState(isNew || false);
//   const [localFormData, setLocalFormData] = useState(formData);

//   // Synchroniser les données si formData change depuis le parent
//   useEffect(() => {
//     setLocalFormData(formData);
//   }, [formData]);

//   // Annuler la modification : réinitialiser les données et bloquer l'édition
//   const handleCancel = () => {
//     setLocalFormData(formData);  // revenir aux données initiales
//     setIsEditing(false);
//     if (onCancel) onCancel();
//   };


//   return (
//     <div className="form-card">
//       <form
//         onSubmit={(e) => {
//           handleSubmit(e, localFormData);
//           setIsEditing(false); // bloquer l'édition après enregistrement
//         }}
//         className="form-grid"
//       >

//         {/* Famille */}
//         <h3>Famille</h3>
//         <div className="form-group">
//           <FieldLabel required>Situation familiale</FieldLabel>
//           <select
//             name="situation_social"
//             value={localFormData.situation_social}
//             onChange={handleChange}
//             disabled={!isEditing}
//             required
//           >
//             <option value="">Sélectionner</option>
//             {situationSocialOptions.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <FieldLabel>Nombre d'enfants</FieldLabel>
//           <input
//             type="number"
//             name="nombre_enfants"
//             value={localFormData.nombre_enfants}
//             onChange={handleChange}
//             min="0"
//             disabled={!isEditing}
//           />
//         </div>

//         {/* Éducation */}
//         <h3>Éducation</h3>
//         <div className="form-group">
//           <FieldLabel required>Niveau d'étude</FieldLabel>
//           <select
//             name="niveau_etude"
//             value={localFormData.niveau_etude}
//             onChange={handleChange}
//             disabled={!isEditing}
//             required
//           >
//             <option value="">Sélectionner</option>
//             {niveauEtudeOptions.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//         </div>

//         {/* Activité  */}
//         <h3>Activité & Ressources</h3>
//         <div className="form-group">
//           <FieldLabel required>Activité professionnelle</FieldLabel>
//           <select
//             name="activite_professionnelle"
//             value={localFormData.activite_professionnelle}
//             onChange={handleChange}
//             disabled={!isEditing}
//             required
//           >
//             <option value="">Sélectionner</option>
//             {activiteOptions.map(opt => (
//               <option key={opt.value} value={opt.value}>{opt.label}</option>
//             ))}
//           </select>
//         </div>


//         {/* Problèmes */}
//         <h3>Problèmes rencontrés</h3>
//         <div className="form-group full-width">
//           <div className="toggle-grid">
//             {problemeOptions.map(opt => (
//               <ToggleSwitch
//                 key={opt.value}
//                 id={`probleme-${opt.value}`}
//                 label={opt.label}
//                 checked={localFormData.probleme?.includes(opt.value) || false}
//                 disabled={!isEditing}
//                 onChange={(checked) => handleProblemeChange(opt.value, checked)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Remarques */}
//         <div className="form-group full-width">
//           <FieldLabel>Remarques générales</FieldLabel>
//           <textarea
//             name="remarque"
//             value={localFormData.remarque}
//             onChange={handleChange}
//             disabled={!isEditing}
//             placeholder="Informations complémentaires max 500 caractères"
//             maxLength={500}
//           />
//         </div>

//         <div className="form-group full-width">
//           {!isEditing ? (
//             <button
//               type="button"
//               className="edit-btn"
//               onClick={async () => {
//                 const confirmed = await confirmAction(
//                   "Activer le mode modification ?",
//                   "Vous allez pouvoir modifier les informations sociales."
//                 );
//                 if (!confirmed) return;
//                 setIsEditing(true);
//               }}
//             >
//               Modifier
//             </button>
//           ) : (
//             <div className="edit-actions">
//               <button type="submit" className="save-btn">
//                 {isNew ? "Créer" : "Enregistrer"}
//               </button>
//               <button
//                 type="button"
//                 className="cancel-btn"
//                 onClick={() => {
//                   handleCancel();
//                   toast.info("Modifications annulées");
//                 }}
//               >
//                 Annuler
//              </button>
//             </div>
//           )}
//         </div>

//       </form>
//     </div>
//   );
// }
import SocialForm from "./SocialForm.jsx";
import { useSocialLogic } from "./useSocialLogic.js";
import {
  PROBLEME_OPTIONS,
  NIVEAU_ETUDE_OPTIONS,
  ACTIVITE_OPTIONS,
  SITUATION_SOCIAL_OPTIONS,
} from "./socialForm.constants.js";

export default function SocialFormPage() {
  const logic = useSocialLogic();

  if (logic.loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <div className="page-header">
        <h2>{logic.isEditing ? "Fiche sociale" : "Nouvelle fiche sociale"}</h2>
      </div>
      <SocialForm
        {...logic}
        problemeOptions={PROBLEME_OPTIONS}
        niveauEtudeOptions={NIVEAU_ETUDE_OPTIONS}
        activiteOptions={ACTIVITE_OPTIONS}
        situationSocialOptions={SITUATION_SOCIAL_OPTIONS}
      />
    </div>
  );
}