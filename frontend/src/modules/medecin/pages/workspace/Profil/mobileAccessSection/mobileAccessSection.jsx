
import { useState } from "react";
import { useMobileAccess } from "./useMobileAccess.js";
import CredentialsModal from "./credentialsModal.jsx";
import { LABELS } from "./mobileAccess.constants.js";
import "./mobileAccessSection.css";

export default function MobileAccessSection({ numero }) {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    loading,
    actionLoading,
    error,
    credentials,
    showModal,
    isNoAccount,
    isActive,
    isInactive,
    status,
    handleCreate,
    handleReset,
    handleDeactivate,
    handleCloseModal,
  } = useMobileAccess(numero);

  if (!numero || loading) return null;

  const triggerBadgeIcon = isActive
    ? <i className="bi bi-check-circle-fill"></i>
    : isInactive
    ? <i className="bi bi-x-circle-fill"></i>
    : <i className="bi bi-question-circle-fill"></i>;

  const triggerBadgeClass = isActive
    ? "active"
    : isInactive
    ? "inactive"
    : "none";

  return (
    <>
      {/* Trigger */}
      <button
        className="mobile-access-trigger"
        onClick={() => setModalOpen(true)}
      >
        <i className="bi bi-phone"></i>
        {LABELS.SECTION_TITLE}
        <span className={`trigger-badge ${triggerBadgeClass}`}>
          {triggerBadgeIcon}
        </span>
      </button>

      {/* Modal */}
      {modalOpen && (
        <div
          className="mobile-modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="mobile-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mobile-modal-header">
              <span className="mobile-modal-title">
                <i className="bi bi-shield-lock"></i>
                {LABELS.SECTION_TITLE}
              </span>
              <button
                className="mobile-modal-close"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Patient */}
            <div className="mobile-modal-patient">
              <span className="mobile-modal-patient-numero">
                Dossier: {numero}
              </span>
            </div>

            {/* Error */}
            {error && <p className="mobile-error">{error}</p>}

            {/* Status */}
            <div className="mobile-status-row">
              {isNoAccount && (
                <span className="mobile-status-badge none">
                  <i className="bi bi-person-x"></i>
                  Aucun compte mobile
                </span>
              )}

              {isActive && (
                <>
                  <span className="mobile-status-badge active">
                    <i className="bi bi-check-circle-fill"></i>
                    Compte actif
                  </span>
                  <span className="mobile-status-username">
                    <i className="bi bi-person"></i>
                    {status.username}
                  </span>
                </>
              )}

              {isInactive && (
                <>
                  <span className="mobile-status-badge inactive">
                    <i className="bi bi-x-circle-fill"></i>
                    Compte désactivé
                  </span>
                  <span className="mobile-status-username">
                    <i className="bi bi-person"></i>
                    {status.username}
                  </span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mobile-modal-actions">
              {isNoAccount && (
                <button
                  className="btn-mobile-create"
                  onClick={handleCreate}
                  disabled={actionLoading}
                >
                  <i className="bi bi-person-plus"></i>
                  {LABELS.CREATE}
                </button>
              )}

              {(isActive || isInactive) && (
                <button
                  className="btn-mobile-reset"
                  onClick={handleReset}
                  disabled={actionLoading}
                >
                  <i className="bi bi-key"></i>
                  {LABELS.RESET}
                </button>
              )}

              {isActive && (
                <button
                  className="btn-mobile-deactivate"
                  onClick={handleDeactivate}
                  disabled={actionLoading}
                >
                  <i className="bi bi-person-dash"></i>
                  {LABELS.DEACTIVATE}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showModal && (
        <CredentialsModal
          credentials={credentials}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}