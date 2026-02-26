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
//import React, { useEffect, useState } from "react";
import "./ProfilForme.css";

// Exemple de données statiques gouvernorats
const governorates = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Sousse", "Monastir",
  "Mahdia", "Nabeul", "Zaghouan", "Bizerte", "Jendouba", "Kef",
  "Siliana", "Beja", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Sfax", "Gabes", "Medenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
];

export default function ProfilForm({
  formData,
  onChange,
  onSubmit,
  isNew,
  isEditing,
  setIsEditing,
  onCancel,
  doctors = []
}) {
  // const [filteredCities, setFilteredCities] = useState([]);

  // // Filtrage des villes selon le gouvernorat sélectionné
  // useEffect(() => {
  //   if (formData.birth_address_governorate) {
  //     // Ici tu pourrais filtrer une liste de codes postaux correspondant au gouvernorat
  //     setFilteredCities([formData.birth_address_code_postal]);
  //   }
  // }, [formData.birth_address_governorate]);

  return (
    <div className="form-card">
      <form onSubmit={onSubmit} className="form-grid">

        {/* Numéro dossier */}
        <div className="form-group">
          <label>Numéro dossier</label>
          <input
            name="numero_dossier"
            value={formData.numero_dossier || ""}
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={onChange}
            pattern="[A-Za-zÀ-ÿ\s]+"
            disabled={!isEditing}
            required
          />
        </div>

        {/* Date de naissance */}
        <div className="form-group">
          <label>Date de naissance</label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate || ""}
            onChange={onChange}
            min="1900-01-01"
            max={new Date().toISOString().split("T")[0]}
            disabled={!isEditing}
          />
        </div>

        {/* Sexe */}
        <div className="form-group">
          <label>Sexe</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={onChange}
            disabled={!isEditing}
          >
            <option value="">Sélectionner</option>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>

        {/* Téléphone */}
        <div className="form-group">
          <label>Téléphone</label>
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={onChange}
            pattern="[0-9]{8}"
            title="Le numéro doit contenir 8 chiffres et commencer par 2,5 ou 9"
            disabled={!isEditing}
          />
        </div>

        {/* Adresse exacte */}
        <div className="form-group full-width">
          <label>Adresse exacte</label>
          <textarea
            name="exact_address"
            value={formData.exact_address || ""}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Rue, porte, étage..."
          />
        </div>

        {/* Gouvernorat et code postal naissance */}
          <div className="form-group">
            <label>Adresse naissance</label>
            <select
              name="birth_address_id"
              value={formData.birth_address_id || ""}
              onChange={onChange}
              disabled={!isEditing}
            >
              <option value="">Sélectionner</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.governorate} - {addr.code_postal}
                </option>
              ))}
            </select>
          </div>

          {/* Gouvernorat et code postal résidence */}
          <div className="form-group">
            <label>Adresse résidence</label>
            <select
              name="residence_address_id"
              value={formData.residence_address_id || ""}
              onChange={onChange}
              disabled={!isEditing}
            >
              <option value="">Sélectionner</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.governorate} - {addr.code_postal}
                </option>
              ))}
            </select>
          </div>


        {/* Gouvernorat et code postal résidence */}
        <div className="form-group">
          <label>Gouvernorat résidence</label>
          <select
            name="residence_address_id"
            value={formData.residence_address_id || ""}
            onChange={onChange}
            disabled={!isEditing}
          >
            <option value="">Sélectionner</option>
            {governorates.map((g) => (
              <option key={`res-${g}`} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Code postal résidence</label>
          <input
            name="residence_address_code_postal"
            value={formData.residence_address_code_postal || ""}
            onChange={onChange}
            pattern="[0-9]{4}"
            title="4 chiffres"
            disabled={!isEditing}
          />
        </div>

        {/* Médecin */}
        <div className="form-group">
          <label>Médecin traitant</label>
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

        {/* Remarques */}
        <div className="form-group full-width">
          <label>Remarques</label>
          <textarea
            name="remarques"
            value={formData.remarques || ""}
            onChange={onChange}
            disabled={!isEditing}
            placeholder="Commentaires supplémentaires..."
          />
        </div>

        {/* Actions */}
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
  );
}
