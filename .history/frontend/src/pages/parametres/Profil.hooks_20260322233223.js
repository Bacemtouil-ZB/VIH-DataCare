// import { useState, useEffect, useCallback, useMemo } from "react";
// import toast from "react-hot-toast";

// import {
//   INITIAL_INFO_FORM,
//   INITIAL_PWD_FORM,
//   TOAST_MESSAGES,
// } from "./profil.constants";

// import {
//   hasInfoChanged,
//   validateInfoForm,
//   validatePwdForm,
// } from "./profil.helpers";

// import {
//   updateProfile,
//   updatePassword,
// } from "../../shared/services/profilService.jsx";

// // ─── useInfoForm ──────────────────────────────────────────────────────────────

// export const useInfoForm = (user) => {
//   const [form, setForm] = useState(INITIAL_INFO_FORM);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Seed form from user data — depend on primitive values, not the object reference
//   useEffect(() => {
//     if (user) {
//       setForm({ nom: user.nom, prenom: user.prenom, email: user.email });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.nom, user?.prenom, user?.email]); // ✅ stable primitives, no infinite loop

//   // Derived value — no setState needed, no effect needed
//   const isDirty = useMemo(
//     () => hasInfoChanged(form, user),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [form.nom, form.prenom, form.email, user?.nom, user?.prenom, user?.email],
//   );

//   const setField = useCallback(
//     (field, value) => {
//       setForm((prev) => ({ ...prev, [field]: value }));
//       // Clear field error on change
//       if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
//     },
//     [errors],
//   );

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();

//       const validationErrors = validateInfoForm(form);
//       if (Object.keys(validationErrors).length) {
//         setErrors(validationErrors);
//         return;
//       }

//       setErrors({});
//       setLoading(true);

//       try {
//         await updateProfile(form);
//         toast.success(TOAST_MESSAGES.INFO_SUCCESS);
//       } catch (err) {
//         toast.error(err.message || TOAST_MESSAGES.INFO_ERROR);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [form],
//   );

//   return { form, errors, loading, isDirty, setField, handleSubmit };
// };

// // ─── usePwdForm ───────────────────────────────────────────────────────────────
// /**
//  * Manages the password change section:
//  * form state, show/hide toggles, validation, and submission.
//  */
// export const usePwdForm = () => {
//   const [form, setForm] = useState(INITIAL_PWD_FORM);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [visibility, setVisibility] = useState({
//     currentPassword: false,
//     newPassword: false,
//     confirmPassword: false,
//   });

//   const setField = useCallback(
//     (field, value) => {
//       setForm((prev) => ({ ...prev, [field]: value }));
//       if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
//     },
//     [errors],
//   );

//   const toggleVisibility = useCallback((field) => {
//     setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
//   }, []);

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();

//       const validationErrors = validatePwdForm(form);
//       if (Object.keys(validationErrors).length) {
//         setErrors(validationErrors);
//         return;
//       }

//       setErrors({});
//       setLoading(true);

//       try {
//         await updatePassword({
//           currentPassword: form.currentPassword,
//           newPassword: form.newPassword,
//         });
//         toast.success(TOAST_MESSAGES.PWD_SUCCESS);
//         setForm(INITIAL_PWD_FORM);
//       } catch (err) {
//         toast.error(err.message || TOAST_MESSAGES.PWD_ERROR);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [form],
//   );

//   return {
//     form,
//     errors,
//     loading,
//     visibility,
//     setField,
//     toggleVisibility,
//     handleSubmit,
//   };
// };
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

// ─── useInfoForm ──────────────────────────────────────────────────────────────

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

      // ── UX: no changes guard ──────────────────────────────────────────────
      if (!isDirty) {
        toast(TOAST_MESSAGES.NO_CHANGES, {
          icon: "ℹ️",
          duration: 3000,
        });
        return;
      }

      // ── UX: validation feedback ───────────────────────────────────────────
      const validationErrors = validateInfoForm(form);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        toast.error(TOAST_MESSAGES.VALIDATION_ERROR, { duration: 3000 });
        return;
      }

      setErrors({});
      setLoading(true);

      // ── UX: loading → success / error toast ───────────────────────────────
      const toastId = toast.loading(TOAST_MESSAGES.INFO_LOADING);

      try {
        await updateProfile(form);
        toast.success(TOAST_MESSAGES.INFO_SUCCESS, { id: toastId });
      } catch (err) {
        toast.error(err.message || TOAST_MESSAGES.INFO_ERROR, { id: toastId });
      } finally {
        setLoading(false);
      }
    },
    [form, isDirty],
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

      // ── UX: validation feedback ───────────────────────────────────────────
      const validationErrors = validatePwdForm(form);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        toast.error(TOAST_MESSAGES.VALIDATION_ERROR, { duration: 3000 });
        return;
      }

      setErrors({});
      setLoading(true);

      // ── UX: loading → success / error toast ───────────────────────────────
      // SUCCESS message already tells the user to check their email:
      // "Mot de passe modifié • Vérifiez votre email"
      const toastId = toast.loading(TOAST_MESSAGES.PWD_LOADING);

      try {
        await updatePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
        toast.success(TOAST_MESSAGES.PWD_SUCCESS, {
          id: toastId,
          duration: 6000, // longer so the user reads the email instruction
        });
        setForm(INITIAL_PWD_FORM);
      } catch (err) {
        toast.error(err.message || TOAST_MESSAGES.PWD_ERROR, { id: toastId });
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
