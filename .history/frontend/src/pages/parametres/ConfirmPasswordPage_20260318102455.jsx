// ─── ConfirmPasswordPage.jsx ──────────────────────────────────────────────────
// Landed on when user clicks the confirmation link in their email.
// Reads ?token= from URL, calls the API, shows result.

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { confirmPasswordChange } from "../../shared/services/profilService.jsx";
import "./confirm-password.css";

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export default function ConfirmPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  // Derive initial state from token presence — no setState in effect body
  const [status, setStatus] = useState(token ? STATUS.LOADING : STATUS.ERROR);
  const [message, setMessage] = useState(token ? "" : "Lien invalide : aucun token fourni.");

  useEffect(() => {
    if (!token) return; // already handled by initial state

    confirmPasswordChange(token)
      .then(() => {
        setStatus(STATUS.SUCCESS);
        setMessage("Votre mot de passe a été modifié avec succès.");
      })
      .catch((err) => {
        setStatus(STATUS.ERROR);
        setMessage(err.message || "Lien invalide ou expiré.");
      });
  }, []);

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        {status === STATUS.LOADING && (
          <>
            <Loader size={36} className="confirm-icon confirm-icon--loading" />
            <h1 className="confirm-title">Vérification en cours…</h1>
            <p className="confirm-text">Veuillez patienter.</p>
          </>
        )}

        {status === STATUS.SUCCESS && (
          <>
            <CheckCircle size={36} className="confirm-icon confirm-icon--success" />
            <h1 className="confirm-title">Mot de passe modifié</h1>
            <p className="confirm-text">{message}</p>
            <button className="confirm-btn" onClick={() => navigate("/login")}>
              Se connecter
            </button>
          </>
        )}

        {status === STATUS.ERROR && (
          <>
            <XCircle size={36} className="confirm-icon confirm-icon--error" />
            <h1 className="confirm-title">Lien invalide</h1>
            <p className="confirm-text">{message}</p>
            <button className="confirm-btn confirm-btn--secondary" onClick={() => navigate(-1)}>
              Retour
            </button>
          </>
        )}
      </div>
    </div>
  );
}