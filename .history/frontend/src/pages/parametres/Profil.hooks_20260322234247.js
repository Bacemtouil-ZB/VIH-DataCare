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
/**
 * @param {object} user         - current user object from context / store
 * @param {function} onSuccess  - called with updated fields after a successful save
 *                                so the parent can sync its user state → isDirty resets
 *
 * Usage in your component:
 *   const { form, ... } = useInfoForm(user, (updated) => setUser({ ...user, ...updated }));
 */
export const useInfoForm = (user, onSuccess) => {
  const [form, setForm] = useState(INITIAL_INFO_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Seed form from user data
  useEffect(() => {
    if (user) {
      setForm({ nom: user.nom, prenom: user.prenom, email: user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.nom, user?.prenom, user?.email]);

  // isDirty compares current form against the live `user` prop.
  // It resets to false automatically once the parent updates `user` via onSuccess.
  const isDirty = useMemo(
    () => hasInfoChanged(form, user),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.nom, form.prenom, form.email, user?.nom, user?.prenom, user?.email],
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

      // Guard: nothing changed
      if (!isDirty) {
        toast(TOAST_MESSAGES.NO_CHANGES, { icon: "ℹ️", duration: 3000 });
        return;
      }

      // Guard: invalid fields
      const validationErrors = validateInfoForm(form);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        toast.error(TOAST_MESSAGES.VALIDATION_ERROR, { duration: 3000 });
        return;
      }

      setErrors({});
      setLoading(true);
      const toastId = toast.loading(TOAST_MESSAGES.INFO_LOADING);

      try {
        await updateProfile(form);
        toast.success(TOAST_MESSAGES.INFO_SUCCESS, { id: toastId });

        // ✅ Sync parent user state so isDirty flips back to false
        // and the "Modifications non sauvegardées" banner disappears.
        onSuccess?.({ nom: form.nom, prenom: form.prenom, email: form.email });
      } catch (err) {
        toast.error(err.message || TOAST_MESSAGES.INFO_ERROR, { id: toastId });
      } finally {
        setLoading(false);
      }
    },
    [form, isDirty, onSuccess],
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

      // ✅ Client-side: reject same-as-current password before hitting the API
      if (
        form.newPassword &&
        form.currentPassword &&
        form.newPassword === form.currentPassword
      ) {
        setErrors((prev) => ({
          ...prev,
          newPassword:
            "Le nouveau mot de passe doit être différent de l'actuel",
        }));
        toast.error("Le nouveau mot de passe doit être différent de l'actuel", {
          duration: 4000,
        });
        return;
      }

      // Standard field validation
      const validationErrors = validatePwdForm(form);
      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        toast.error(TOAST_MESSAGES.VALIDATION_ERROR, { duration: 3000 });
        return;
      }

      setErrors({});
      setLoading(true);
      const toastId = toast.loading(TOAST_MESSAGES.PWD_LOADING);

      try {
        await updatePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });

        // PWD_SUCCESS = "Mot de passe modifié • Vérifiez votre email"
        // duration 6s so the user has time to read the email instruction
        toast.success(TOAST_MESSAGES.PWD_SUCCESS, {
          id: toastId,
          duration: 6000,
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
