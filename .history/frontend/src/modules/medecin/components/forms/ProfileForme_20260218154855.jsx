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


// import "./ProfilForme.css";

// export default function ProfilForm({
//   formData,
//   onChange,
//   onSubmit,
//   isNew,
//   isEditing,
//   setIsEditing,
//   onCancel,
//   doctors = [],
//   addresses = []
// }) {

//   // Extraire gouvernorats uniques depuis addresses
//   const uniqueGovernorates = [
//     ...new Set(addresses.map(a => a.governorate))
//   ];

//   // Filtrer codes postaux selon gouvernorat sélectionné
//   const filteredResidencePostalCodes = addresses.filter(
//     a => a.governorate === formData.residence_governorate
//   );



//   return (
//     <div className="form-card">
//       <form onSubmit={onSubmit} className="form-grid">

//         {/* Numéro dossier */}
//         <div className="form-group">
//           <label>Numéro dossier</label>
//           <input
//             name="numero"
//             value={formData.numero || ""}
//             onChange={onChange}
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
//             onChange={onChange}
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
//             onChange={onChange}
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
//             onChange={onChange}
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
//             onChange={onChange}
//             max={new Date().toISOString().split("T")[0]}
//             disabled={!isEditing}
//             required
//           />
//         </div>

//         {/* Sexe (radio buttons) */}
//         <div className="form-group">
//           <label>Sexe</label>
//           <div className="radio-group">
//             <label>
//               <input
//                 type="radio"
//                 name="gender"
//                 value="homme"
//                 checked={formData.gender === "homme"}
//                 onChange={onChange}
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
//                 onChange={onChange}
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
//             onChange={onChange}
//             pattern="[0-9]{8}"
//             title="Le numéro doit contenir 8 chiffres"
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
//             onChange={onChange}
//             disabled={!isEditing}
//             required
//           >
//             <option value="">Sélectionner</option>
//             {uniqueGovernorates.map((g) => (
//               <option key={g} value={g}>
//                 {g}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Gouvernorat résidence */}
//         <div className="form-group">
//           <label>Gouvernorat résidence</label>
//           <select
//             name="residence_governorate"
//             value={formData.residence_governorate || ""}
//             onChange={onChange}
//             disabled={!isEditing}
//             required
//           >
//             <option value="">Sélectionner</option>
//             {uniqueGovernorates.map((g) => (
//               <option key={g} value={g}>
//                 {g}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Code postal résidence */}
//         <div className="form-group">
//           <label>Code postal résidence</label>
//           <select
//             name="residence_postal_code_id"
//             value={formData.residence_postal_code_id || ""}
//             onChange={onChange}
//             disabled={!isEditing || !formData.residence_governorate}
//             required
//           >
//             <option value="">Sélectionner</option>
//             {filteredResidencePostalCodes.map((addr) => (
//               <option key={addr.id} value={addr.id}>
//                 {addr.code_postal}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Adresse exacte résidence */}
//         <div className="form-group full-width">
//           <label>Adresse exacte</label>
//           <textarea
//             name="residence_exact_address"
//             value={formData.residence_exact_address || ""}
//             onChange={onChange}
//             disabled={!isEditing}
//             placeholder="Rue, numéro, porte, étage..."
//             rows={3}
//           />
//         </div>

//         {/* Médecin */}
//         <div className="form-group">
//           <label>Médecin traitant</label>
//           <select
//             name="doctor_id"
//             value={formData.doctor_id || ""}
//             onChange={onChange}
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
//             name="remarques"
//             value={formData.remarques || ""}
//             onChange={onChange}
//             disabled={!isEditing}
//           />
//         </div>

//         {/* Actions */}
//         <div className="form-group full-width">
//           {!isEditing ? (
//             <button
//               type="button"
//               className="edit-btn"
//               onClick={() => setIsEditing(true)}
//             >
//               Modifier
//             </button>
//           ) : (
//             <div className="edit-actions">
//               <button type="submit" className="save-btn">
//                 {isNew ? "Créer" : "Enregistrer"}
//               </button>
//               {!isNew && (
//                 <button
//                   type="button"
//                   className="cancel-btn"
//                   onClick={onCancel}
//                 >
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


export default function ProfilForm({
  formData,
  setFormData,
  onSubmit,
  isNew,
  isEditing,
  setIsEditing,
  onCancel,
  doctors = [],
  addresses = []
}) {

  /* ------------------ HANDLE CHANGE SECURISE ------------------ */
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Protection XSS simple
    if (typeof value === "string") {
      value = value.replace(/[<>]/g, "");
    }

    setFormData(prev => {

      // Reset code postal si gouvernorat naissance change
      if (name === "birth_governorate") {
        return {
          ...prev,
          birth_governorate: value,
          birth_postal_code_id: ""
        };
      }

      // Reset code postal si gouvernorat résidence change
      if (name === "residence_governorate") {
        return {
          ...prev,
          residence_governorate: value,
          residence_postal_code_id: ""
        };
      }

      return { ...prev, [name]: value };
    });
  };


/* ------------------ AGE AUTO ------------------ */
const calculateAge = () => {
  if (!formData.birthdate) return "";

  const today = new Date();
  const birth = new Date(formData.birthdate);

  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    years--;
  }

  return years;
};

const age = calculateAge();

  /* ------------------ LISTES ------------------ */
  const uniqueGovernorates = [...new Set(addresses.map(a => a.governorate))];

  const filteredResidencePostalCodes = addresses.filter(
    a => a.governorate === formData.residence_governorate
  );

  const filteredBirthPostalCodes = addresses.filter(
    a => a.governorate === formData.birth_governorate
  );
console.log("PC0:", postalCodes[0], "GOV0:", governorates[0]);

  return (
    <div className="form-card">
      <form onSubmit={onSubmit} className="form-grid">

        {/* Numéro dossier */}
        <div className="form-group">
          <label>Numéro dossier</label>
          <input
            name="numero"
            value={formData.numero || ""}
            onChange={handleChange}
            disabled={!isNew}
            required
          />
        </div>

        {/* Hospitalisation */}
        <div className="form-group">
          <label>Hospitalisation</label>
          <select
            name="hospitalisation"
            value={formData.hospitalisation || "externe"}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="externe">Externe</option>
            <option value="interne">Interne</option>
          </select>
        </div>

        {/* Nom */}
        <div className="form-group">
          <label>Nom</label>
          <input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        {/* Prénom */}
        <div className="form-group">
          <label>Prénom</label>
          <input
            name="surname"
            value={formData.surname || ""}
            onChange={handleChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        {/* Date naissance */}
        <div className="form-group">
          <label>Date de naissance</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate || ""}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            disabled={!isEditing}
            required
          />
        </div>

        {/* Age auto */}
        <div className="form-group">
          <label>Age</label>
          <input value={age} disabled />
        </div>

        {/* Sexe */}
        <div className="form-group">
          <label>Sexe</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="homme"
                checked={formData.gender === "homme"}
                onChange={handleChange}
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
                onChange={handleChange}
                disabled={!isEditing}
              />
              Femme
            </label>
          </div>
        </div>

        {/* Téléphone tunisien */}
        <div className="form-group">
          <label>Téléphone</label>
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            pattern="^[24597][0-9]{7}$"
            title="Numéro tunisien invalide"
            disabled={!isEditing}
            required
          />
        </div>

        {/* Gouvernorat naissance */}
        <div className="form-group">
          <label>Gouvernorat naissance</label>
          <select
            name="birth_governorate"
            value={formData.birth_governorate || ""}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {uniqueGovernorates.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Code postal naissance */}
        <div className="form-group">
          <label>Code postal naissance</label>
          <select
            name="birth_postal_code_id"
            value={formData.birth_postal_code_id || ""}
            onChange={handleChange}
            disabled={!isEditing || !formData.birth_governorate}
            required
          >
            <option value="">
              {formData.birth_governorate
                ? "Sélectionner"
                : "Choisir d'abord un gouvernorat"}
            </option>
            {filteredBirthPostalCodes.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.code_postal}
              </option>
            ))}
          </select>
        </div>

        {/* Gouvernorat résidence */}
        <div className="form-group">
          <label>Gouvernorat résidence</label>
          <select
            name="residence_governorate"
            value={formData.residence_governorate || ""}
            onChange={handleChange}
            disabled={!isEditing}
            required
          >
            <option value="">Sélectionner</option>
            {uniqueGovernorates.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Code postal résidence */}
        <div className="form-group">
          <label>Code postal résidence</label>
          <select
            name="residence_postal_code_id"
            value={formData.residence_postal_code_id || ""}
            onChange={handleChange}
            disabled={!isEditing || !formData.residence_governorate}
            required
          >
            <option value="">
              {formData.residence_governorate
                ? "Sélectionner"
                : "Choisir d'abord un gouvernorat"}
            </option>
            {filteredResidencePostalCodes.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.code_postal}
              </option>
            ))}
          </select>
        </div>

        {/* Adresse exacte */}
        <div className="form-group full-width">
          <label>Adresse exacte</label>
          <textarea
            name="residence_exact_address"
            value={formData.residence_exact_address || ""}
            onChange={handleChange}
            disabled={!isEditing}
            rows={3}
          />
        </div>

        {/* Médecin */}
        <div className="form-group">
          <label>Médecin traitant</label>
          <select
            name="doctor_id"
            value={formData.doctor_id || ""}
            onChange={handleChange}
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

        {/* Remarques */}
        <div className="form-group full-width">
          <label>Remarques</label>
          <textarea
            name="remarques"
            value={formData.remarques || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Actions */}
        <div className="form-group full-width">
          {!isEditing ? (
            <button
              type="button"
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </button>
          ) : (
            <div className="edit-actions">
              <button type="submit" className="save-btn">
                {isNew ? "Créer" : "Enregistrer"}
              </button>
              {!isNew && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onCancel}
                >
                  Annuler
                </button>
              )}
            </div>
          )}
        </div>

      </form>
    </div>
  );
}
