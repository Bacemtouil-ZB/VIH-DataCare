import { useState } from "react";
import "./Dashbord.css";
export default function CnamForm() {

  const [formData, setFormData] = useState({
    nom: "",
    matricule: "",
    naissance: "",
    adresse: "",
    tel: "",

    medecin: "",
    specialite: "",
    matriculeMed: "",
    adresseMed: "",

    dateActe: "",
    natureActe: "",
    montant: "",
    paiement: "",

    medicaments: [
      { designation: "", quantite: "", prix: "" }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMedicChange = (index, e) => {
    const values = [...formData.medicaments];
    values[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      medicaments: values
    });
  };

  const addMedic = () => {
    setFormData({
      ...formData,
      medicaments: [...formData.medicaments, { designation: "", quantite: "", prix: "" }]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="container">

      <h2>Feuille de soins</h2>

      <section>
        <h3>Identification de l'assuré</h3>

        <input name="nom" placeholder="Nom et prénom" onChange={handleChange} />
        <input name="matricule" placeholder="N° CNAM" onChange={handleChange} />
        <input type="date" name="naissance" onChange={handleChange} />
        <input name="adresse" placeholder="Adresse" onChange={handleChange} />
        <input name="tel" placeholder="Téléphone" onChange={handleChange} />

      </section>

      <section>
        <h3>Identification du médecin</h3>

        <input name="medecin" placeholder="Nom du médecin" onChange={handleChange} />
        <input name="specialite" placeholder="Spécialité" onChange={handleChange} />
        <input name="matriculeMed" placeholder="Matricule médecin" onChange={handleChange} />
        <input name="adresseMed" placeholder="Adresse cabinet" onChange={handleChange} />

      </section>

      <section>
        <h3>Actes médicaux</h3>

        <input type="date" name="dateActe" onChange={handleChange} />
        <input name="natureActe" placeholder="Nature de l'acte" onChange={handleChange} />
        <input name="montant" placeholder="Montant" onChange={handleChange} />

        <select name="paiement" onChange={handleChange}>
          <option value="">Mode paiement</option>
          <option value="especes">Espèces</option>
          <option value="cheque">Chèque</option>
        </select>

      </section>

      <section>

        <h3>Médicaments</h3>

        {formData.medicaments.map((med, index) => (

          <div key={index} className="medic-row">

            <input
              name="designation"
              placeholder="Désignation"
              value={med.designation}
              onChange={(e) => handleMedicChange(index, e)}
            />

            <input
              name="quantite"
              placeholder="Quantité"
              value={med.quantite}
              onChange={(e) => handleMedicChange(index, e)}
            />

            <input
              name="prix"
              placeholder="Prix"
              value={med.prix}
              onChange={(e) => handleMedicChange(index, e)}
            />

          </div>

        ))}

        <button type="button" onClick={addMedic}>
          Ajouter médicament
        </button>

      </section>

      <section>

        <h3>Documents</h3>

        <input type="file" />
        <input type="file" />
        <input type="file" />

      </section>

      <button type="submit">Envoyer la demande</button>

    </form>
  );
}