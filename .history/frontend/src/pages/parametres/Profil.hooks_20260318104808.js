// ─── profil.hooks.js ──────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";

import {
  INITIAL_INFO_FORM,
  INITIAL_PWD_FORM,
  TOAST_MESSAGES,
} from "./profil.constants";

import {
  hasInfoChanged,
  validateInfoForm,
  validatePwdForm,
} from "./profil.helpers";

// Replace these with your real service imports:
// import { updateProfile, updatePassword } from "@/services/profil.service";
import {
  updateProfile,
  updatePassword,
} from "../../shared/services/profilService.jsx";

// ─── useInfoForm ──────────────────────────────────────────────────────────────
/**
 * Manages the personal info section:
 * form state, dirty detection, validation, and submission.
 */
export const useInfoForm = (user) => {
  const [form, setForm] = useState(INITIAL_INFO_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Seed form from user data — depend on primitive values, not the object reference
  useEffect(() => {
    if (user) {
      setForm({ nom: user.nom, prenom: user.prenom, email: user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.nom, user?.prenom, user?.email]); // ✅ stable primitives, no infinite loop

  // Derived value — no setState needed, no effect needed
  const isDirty = useMemo(
    () => hasInfoChanged(form, user),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.nom, form.prenom, form.email, user?.nom, user?.prenom, user?.email],
  );

  const setField = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
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

      setErrors({});
      setLoading(true);

      try {
        await updateProfile(form);
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
/**
 * Manages the password change section:
 * form state, show/hide toggles, validation, and submission.
 */
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
