import  "./Profilpage.css";

export default function ProfilPage() {
  return (
    <div className="medical-page">
      <h2>Profil du patient</h2>

      <div className="form-grid">
        <input placeholder="Nom" />
        <input placeholder="Prénom" />
        <input type="date" placeholder="Date de naissance" />
        <input placeholder="Sexe" />
        <input placeholder="Numéro dossier" />
        <input placeholder="Téléphone" />
        <input placeholder="Adresse" />
      </div>
      
    </div>
  );
}
