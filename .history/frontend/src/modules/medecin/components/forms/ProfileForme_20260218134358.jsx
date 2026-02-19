// import React from "react";
// import "./ProfilForme.css";

// export default function ProfilForm({
//   formData,
//   onChange,
//   onSubmit,
//   isNew,
//   isEditing,
//   setIsEditing,
//   onCancel
// }) {
//   return (
//     <div className="form-card">
//       <form onSubmit={onSubmit} className="form-grid">

//         <div className="form-group">
//           <label>Numéro dossier</label>
//           <input
//             name="numero"
//             value={formData.numero}
//             onChange={onChange}
//             disabled={!isNew}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Hospitalisation</label>
//           <select
//             name="hospitalisation"
//             value={formData.hospitalisation}
//             onChange={onChange}
//             disabled={!isEditing}
//           >
//             <option value="externe">Externe</option>
//             <option value="interne">Interne</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Nom</label>
//           <input
//             name="name"
//             value={formData.name}
//             onChange={onChange}
//             pattern="[A-Za-zÀ-ÿ\s]+"
//             disabled={!isEditing}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Prénom</label>
//           <input
//             name="surname"
//             value={formData.surname}
//             onChange={onChange}
//             pattern="[A-Za-zÀ-ÿ\s]+"
//             disabled={!isEditing}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Date de naissance</label>
//           <input
//             type="date" 
//             name="birthdate"
//             min="1900-01-01"
//             max="<?= date('Y-m-d') ?>"
//             value={formData.birthdate}
//             onChange={onChange}
//             disabled={!isEditing}
//           />
//         </div>

//         <div className="form-group">
//           <label>Sexe</label>
//           <select
//             name="gender"
//             value={formData.gender}
//             onChange={onChange}
//             disabled={!isEditing}
//           >
//             <option value="">Sélectionner</option>
//             <option value="Homme">Homme</option>
//             <option value="Femme">Femme</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Téléphone</label>
//           <input
//             name="phone"
//             value={formData.phone}
//             onChange={onChange}
//             pattern="[0-9]{8}"
//             title="Le numéro doit contenir 8 chiffres"
//             disabled={!isEditing}
//           />
//         </div>

//         <div className="form-group full-width">
//           <label>Adresse</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={onChange}
//             disabled={!isEditing}
//           />
//         </div>

//         {!isNew && (
//           <div className="form-group full-width">
//             <label>Dernière modification</label>
//             <input
//               value={`${formData.updated_by_name || "-"} - ${formData.updated_at || "-"}`}
//               disabled
//             />
//           </div>
//         )}

//         <div className="form-group full-width">
//           {!isEditing ? (
//             <button
//               type="button"
//               className="edit-btn"
//               onClick={() => setIsEditing(true)}
//             >
//                Modifier
//             </button>
//           ) : (
//             <div className="edit-actions">
//               <button type="submit" className="save-btn">
//                  {isNew ? "Créer" : "Enregistrer"}
//               </button>

//               {!isNew && (
//                 <button
//                   type="button"
//                   className="cancel-btn"
//                   onClick={onCancel}
//                 >
//                    Annuler
//                 </button>
//               )}
//          </div>
//       )}
//     </div>
//       </form>
//   </div>
//   );
// }
<div className="form-card">
  <form onSubmit={onSubmit} className="form-grid">

    {/* ------------------ Informations générales ------------------ */}
    <fieldset className="form-section">
      <legend>Informations générales</legend>

      <div className="form-group">
        <label>Numéro dossier</label>
        <input
          name="numero"
          value={formData.numero || ""}
          onChange={onChange}
          disabled={!isNew}
          required
        />
      </div>

      <div className="form-group">
        <label>Hospitalisation</label>
        <select
          name="hospitalisation"
          value={formData.hospitalisation || "externe"}
          onChange={onChange}
          disabled={!isEditing}
        >
          <option value="externe">Externe</option>
          <option value="interne">Interne</option>
        </select>
      </div>
    </fieldset>

    {/* ------------------ Identité ------------------ */}
    <fieldset className="form-section">
      <legend>Identité</legend>

      <div className="form-group">
        <label>Nom</label>
        <input
          name="name"
          value={formData.name || ""}
          onChange={onChange}
          pattern="[A-Za-zÀ-ÿ\s]+"
          disabled={!isEditing}
          required
        />
      </div>

      <div className="form-group">
        <label>Prénom</label>
        <input
          name="surname"
          value={formData.surname || ""}
          onChange={onChange}
          pattern="[A-Za-zÀ-ÿ\s]+"
          disabled={!isEditing}
          required
        />
      </div>

      <div className="form-group">
        <label>Date de naissance</label>
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate || ""}
          onChange={onChange}
          max={new Date().toISOString().split("T")[0]}
          disabled={!isEditing}
          required
        />
      </div>

      <div className="form-group">
        <label>Sexe</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="homme"
              checked={formData.gender === "homme"}
              onChange={onChange}
              disabled={!isEditing}
            />
            Homme
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="femme"
              checked={formData.gender === "femme"}
              onChange={onChange}
              disabled={!isEditing}
            />
            Femme
          </label>
        </div>
      </div>
    </fieldset>

    {/* ------------------ Adresse de naissance ------------------ */}
    <fieldset className="form-section">
      <legend>Adresse de naissance</legend>

      <div className="form-group">
        <label>Gouvernorat</label>
        <select
          name="birth_governorate"
          value={formData.birth_governorate || ""}
          onChange={onChange}
          disabled={!isEditing}
          required
        >
          <option value="">Sélectionner</option>
          {uniqueGovernorates.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Code postal</label>
        <select
          name="birth_postal_code_id"
          value={formData.birth_postal_code_id || ""}
          onChange={onChange}
          disabled={!isEditing || !formData.birth_governorate}
          required
        >
          <option value="">Sélectionner</option>
          {filteredBirthPostalCodes.map((addr) => (
            <option key={addr.id} value={addr.id}>{addr.code_postal}</option>
          ))}
        </select>
      </div>
    </fieldset>

    {/* ------------------ Adresse de résidence ------------------ */}
    <fieldset className="form-section">
      <legend>Adresse de résidence</legend>

      <div className="form-group">
        <label>Gouvernorat</label>
        <select
          name="residence_governorate"
          value={formData.residence_governorate || ""}
          onChange={onChange}
          disabled={!isEditing}
          required
        >
          <option value="">Sélectionner</option>
          {uniqueGovernorates.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Code postal</label>
        <select
          name="residence_postal_code_id"
          value={formData.residence_postal_code_id || ""}
          onChange={onChange}
          disabled={!isEditing || !formData.residence_governorate}
          required
        >
          <option value="">Sélectionner</option>
          {filteredResidencePostalCodes.map((addr) => (
            <option key={addr.id} value={addr.id}>{addr.code_postal}</option>
          ))}
        </select>
      </div>

      <div className="form-group full-width">
        <label>Adresse exacte</label>
        <textarea
          name="residence_exact_address"
          value={formData.residence_exact_address || ""}
          onChange={onChange}
          disabled={!isEditing}
          placeholder="Rue, numéro, porte, étage..."
          rows={3}
        />
      </div>
    </fieldset>

    {/* ------------------ Médecin ------------------ */}
    <fieldset className="form-section">
      <legend>Médecin traitant</legend>

      <div className="form-group">
        <label>Médecin</label>
        <select
          name="doctor_id"
          value={formData.doctor_id || ""}
          onChange={onChange}
          disabled={!isEditing}
        >
          <option value="">Sélectionner</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.nom} {doc.prenom}
            </option>
          ))}
        </select>
      </div>
    </fieldset>

    {/* ------------------ Remarques ------------------ */}
    <fieldset className="form-section">
      <legend>Remarques</legend>
      <div className="form-group full-width">
        <textarea
          name="remarques"
          value={formData.remarques || ""}
          onChange={onChange}
          disabled={!isEditing}
        />
      </div>
    </fieldset>

    {/* ------------------ Actions ------------------ */}
    <div className="form-group full-width">
      {!isEditing ? (
        <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
          Modifier
        </button>
      ) : (
        <div className="edit-actions">
          <button type="submit" className="save-btn">
            {isNew ? "Créer" : "Enregistrer"}
          </button>
          {!isNew && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Annuler
            </button>
          )}
        </div>
      )}
    </div>

  </form>
</div>
