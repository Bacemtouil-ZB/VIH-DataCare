import { useState, useEffect, useCallback } from "react";
import {
  getMobileAccountStatus,
  createMobileAccount,
  resetMobilePassword,
} from "../../../../services/patientServices.jsx";
import { getAccountStatus } from "./mobileAccess.helpers.js";
import { MOBILE_ACCESS_STATUS, MESSAGES } from "./mobileAccess.constants.js";
import { confirmAction } from "../../../../../../shared/utils/uiAlerts";

export const useMobileAccess = (numero) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!numero) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getMobileAccountStatus(numero);
      setStatus(data);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [numero]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleCreate = async () => {
    const confirmed = await confirmAction(
      MESSAGES.CREATE_CONFIRM,
      "Un identifiant et un mot de passe temporaire seront générés."
    );
    if (!confirmed) return;
    try {
      setActionLoading(true);
      setError(null);
      const data = await createMobileAccount(numero);
      setCredentials(data.credentials);
      setShowModal(true);
      await fetchStatus();
    } catch (err) {
      setError(err.message || "Erreur lors de la création");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    const confirmed = await confirmAction(
      MESSAGES.RESET_CONFIRM,
      "Un nouveau mot de passe temporaire sera généré."
    );
    if (!confirmed) return;
    try {
      setActionLoading(true);
      setError(null);
      const data = await resetMobilePassword(numero);
      setCredentials(data.credentials);
      setShowModal(true);
    } catch (err) {
      setError(err.message || "Erreur lors de la réinitialisation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCredentials(null);
  };

  const accountStatus = status ? getAccountStatus(status) : null;

  return {
    status,
    accountStatus,
    loading,
    actionLoading,
    error,
    credentials,
    showModal,
    isNoAccount: accountStatus === MOBILE_ACCESS_STATUS.NO_ACCOUNT,
    isActive: accountStatus === MOBILE_ACCESS_STATUS.ACTIVE,
    isInactive: accountStatus === MOBILE_ACCESS_STATUS.INACTIVE,
    handleCreate,
    handleReset,
    handleCloseModal,
  };
};