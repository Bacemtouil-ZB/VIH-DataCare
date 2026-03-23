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

import {
  updateProfile,
  updatePassword,
} from "../../shared/services/profilService.jsx";

/* ─── useInfoForm ─────────────────────────────────────────────────────────── */

export const useInfoForm = (user) => {
  const [form, setForm] = useState(INITIAL_INFO_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ nom: user.nom, prenom: user.prenom, email: user.email });
    }
  }, [user?.nom, user?.prenom, user?.email]);

  const isDirty = useMemo(
    () => hasInfoChanged(form, user),
    [form.nom, form.prenom, form.email, user?.nom, user?.prenom, user?.email],
  );

  const setField = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // 🔔 No changes feedback
      if (!isDirty) {
        toast(TOAST_MESSAGES.NO_CHANGES || "Aucune modification", {
          icon: "ℹ️",
        });
        return;
      }

      const validationErrors = validateInfoForm(form);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        toast.error(
          TOAST_MESSAGES.VALIDATION_ERROR || "Veuillez corriger les champs",
        );
        return;
      }

      setErrors({});
      setLoading(true);

      try {
        // 🔥 Clean async UX
        await toast.promise(updateProfile(form), {
          loading: TOAST_MESSAGES.INFO_LOADING || "Mise à jour du profil...",
          success:
            TOAST_MESSAGES.INFO_SUCCESS || "Profil mis à jour avec succès",
          error: (err) =>
            err?.message ||
            TOAST_MESSAGES.INFO_ERROR ||
            "Erreur lors de la mise à jour",
        });
      } finally {
        setLoading(false);
      }
    },
    [form, isDirty],
  );

  return { form, errors, loading, isDirty, setField, handleSubmit };
};

/* ─── usePwdForm ─────────────────────────────────────────────────────────── */

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
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
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
        toast.error(
          TOAST_MESSAGES.VALIDATION_ERROR || "Veuillez corriger les champs",
        );
        return;
      }

      setErrors({});
      setLoading(true);

      try {
        await toast.promise(
          updatePassword({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
          {
            loading:
              TOAST_MESSAGES.PWD_LOADING || "Mise à jour du mot de passe...",

            success: () => {
              setForm(INITIAL_PWD_FORM);
              return (
                TOAST_MESSAGES.PWD_SUCCESS ||
                "Mot de passe modifié • Vérifiez votre email"
              );
            },

            error: (err) =>
              err?.message ||
              TOAST_MESSAGES.PWD_ERROR ||
              "Erreur lors du changement de mot de passe",
          },
        );
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
