// cheked 15/04/2026
import { LABELS, MESSAGES } from "./mobileAccess.constants.js";
import { printCredentials } from "./mobileAccess.helpers.js";

export default function CredentialsModal({ credentials, onClose }) {
  if (!credentials) return null;

  return (
    <div className="mobile-modal-overlay" onClick={onClose}>
      <div className="mobile-modal-box" onClick={(e) => e.stopPropagation()}>

        <div className="mobile-modal-header">
          <span className="mobile-modal-title">
            <i className="bi bi-check-circle"></i>
            Accès mobile créé
          </span>
          <button className="mobile-modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="credentials-warning">
          <i className="bi bi-exclamation-triangle"></i>
          {MESSAGES.CREDENTIALS_WARNING}
        </p>

        <div className="credentials-box">
          <div className="credential-row">
            <span className="credential-label">{LABELS.PATIENT}</span>
            <span className="credential-value">{credentials.patientName}</span>
          </div>

          <div className="credential-row">
            <span className="credential-label">{LABELS.USERNAME}</span>
            <span className="credential-value">{credentials.username}</span>
          </div>

          <div className="credential-row">
            <span className="credential-label">{LABELS.PASSWORD}</span>
            <span className="credential-value credential-password">
              {credentials.password}
            </span>
          </div>
        </div>

        <div className="credentials-print-row">
          <button
            className="btn-print"
            onClick={() => printCredentials(credentials)}
          >
            <i className="bi bi-printer"></i>
            {LABELS.PRINT}
          </button>
        </div>

      </div>
    </div>
  );
}