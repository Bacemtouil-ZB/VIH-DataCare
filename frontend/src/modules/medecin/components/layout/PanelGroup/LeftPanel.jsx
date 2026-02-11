import "./LeftPanel.css";

export default function LeftPanel() {
  return (
    <div className="patient-panel">
      
      <div className="patient-header">
        <div className="patient-avatar">
          AB
        </div>
        <h2 className="patient-name">Ahmed Ben Ali</h2>
        <p className="patient-id">ID: P-2026-001</p>
      </div>

      <div className="patient-info">
        <div className="info-row">
          <span>Age</span>
          <span>32 ans</span>
        </div>

        <div className="info-row">
          <span>Groupe sanguin</span>
          <span>O+</span>
        </div>

        <div className="info-row">
          <span>Téléphone</span>
          <span>+216 55 123 456</span>
        </div>

        <div className="info-row">
          <span>Charge virale</span>
          <span className="badge-warning">Detectable</span>
        </div>
      </div>

      <div className="patient-status">
        <span className="badge-active">Suivi Actif</span>
      </div>

    </div>
  );
}
