import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";

import {
  INITIAL_INFO_FORM,
  INITIAL_PWD_FORM,
  TOAST_MESSAGES,
} from "./Profil.constants.js";

import { validateInfoForm, validatePwdForm } from "./Profil.helpers.js";

import {
  updateProfile,
  updatePassword,
} from "../../shared/services/profilService.jsx";

import { confirmAction } from "../../shared/utils/uiAlerts.js";

// ─── useInfoForm ──────────────────────────────────────────────────────────────

export const useInfoForm = (user) => {
  const [form, setForm] = useState(INITIAL_INFO_FORM);
  const [savedForm, setSavedForm] = useState(INITIAL_INFO_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const values = { nom: user.nom, prenom: user.prenom, email: user.email };
      setForm(values);
      setSavedForm(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.nom, user?.prenom, user?.email]);

  const isDirty = useMemo(
    () =>
      form.nom !== savedForm.nom ||
      form.prenom !== savedForm.prenom ||
      form.email !== savedForm.email,
    [form.nom, form.prenom, form.email, savedForm],
  );

  const setField = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const validationErrors = validateInfoForm(form);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        return;
      }

      const confirmed = await confirmAction({
        title: "Confirmer les modifications",
        message: "Voulez-vous enregistrer les modifications de votre profil ?",
        confirmLabel: "Enregistrer",
        cancelLabel: "Annuler",
      });

      if (!confirmed) return;

      setErrors({});
      setLoading(true);

      try {
        await updateProfile(form);
        setSavedForm(form);
        toast.success(TOAST_MESSAGES.INFO_SUCCESS);
      } catch (err) {
        toast.error(err.message || TOAST_MESSAGES.INFO_ERROR);
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  return { form, errors, loading, isDirty, setField, handleSubmit };
};

// ─── usePwdForm ───────────────────────────────────────────────────────────────

export const usePwdForm = () => {
  const [form, setForm] = useState(INITIAL_PWD_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const setField = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [errors],
  );

  const toggleVisibility = useCallback((field) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const validationErrors = validatePwdForm(form);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});
      setLoading(true);

      try {
        await updatePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
        toast.success(TOAST_MESSAGES.PWD_SUCCESS);
        setForm(INITIAL_PWD_FORM);
      } catch (err) {
        toast.error(err.message || TOAST_MESSAGES.PWD_ERROR);
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  return {
    form,
    errors,
    loading,
    visibility,
    setField,
    toggleVisibility,
    handleSubmit,
  };
};
