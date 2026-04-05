// import { useState, useEffect, useCallback, useRef } from "react";
// import { useBlocker } from "react-router-dom";
// import { toast } from "react-toastify";
// import { getMedical, createMedical, updateMedical } from "../../../../services/antecedentsService.jsx";
// import { formatMedicalFromApi, formatMedicalForApi } from "./medicalHelpers";
// import { MEDICAL_INITIAL_STATE } from "./medicalConstants";

// export default function useMedical(numero) {
//   const [form, setForm] = useState(MEDICAL_INITIAL_STATE);
//   const [savedForm, setSavedForm] = useState(MEDICAL_INITIAL_STATE);
//   const [isExisting, setIsExisting] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);

//   const isHandlingBlock = useRef(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const data = await getMedical(numero);
//         if (data) {
//           const formatted = formatMedicalFromApi(data);
//           setForm(formatted);
//           setSavedForm(formatted);
//           setIsExisting(true);
//           setIsEditing(false);
//         } else {
//           setForm(MEDICAL_INITIAL_STATE);
//           setSavedForm(MEDICAL_INITIAL_STATE);
//           setIsExisting(false);
//           setIsEditing(true);
//         }
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [numero]);

//   const isDirty =
//     isEditing &&
//     JSON.stringify(form) !== JSON.stringify(savedForm);

//   const saveQuiet = useCallback(async () => {
//     try {
//       setSaving(true);
//       const payload = formatMedicalForApi(form);
//       if (isExisting) {
//         await updateMedical(numero, payload);
//       } else {
//         await createMedical(numero, payload);
//         setIsExisting(true);
//       }
//       setSavedForm(form);
//       setIsEditing(false);
//     } finally {
//       setSaving(false);
//     }
//   }, [form, isExisting, numero]);

//   const blocker = useBlocker(isDirty);

//   useEffect(() => {
//     if (blocker.state !== "blocked") return;
//     if (isHandlingBlock.current) return;
//     isHandlingBlock.current = true;

//     const isAntecedentsNav = blocker.location.pathname.includes("/antecedents/");

//     if (isAntecedentsNav) {
//       (async () => {
//         try {
//           await saveQuiet();
//           toast.success("Données sauvegardées automatiquement.");
//         } catch {
//           toast.error("Erreur lors de la sauvegarde automatique.");
//         } finally {
//           blocker.proceed();
//           isHandlingBlock.current = false;
//         }
//       })();
//     } else {
//       const confirmed = window.confirm(
//         "Vous avez des modifications non sauvegardées. Voulez-vous enregistrer avant de partir ?"
//       );
//       if (confirmed) {
//         (async () => {
//           try {
//             await saveQuiet();
//             toast.success("Données sauvegardées.");
//           } catch {
//             toast.error("Erreur lors de la sauvegarde.");
//           } finally {
//             blocker.proceed();
//             isHandlingBlock.current = false;
//           }
//         })();
//       } else {
//         blocker.reset();
//         isHandlingBlock.current = false;
//       }
//     }
//   }, [blocker.state, blocker, saveQuiet]);

//   const handleToggle = (key) => {
//     setForm((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const startEditing = () => setIsEditing(true);

//   const cancelEditing = () => {
//     setForm(savedForm);
//     setIsEditing(false);
//   };

//   const save = async () => {
//     try {
//       setSaving(true);
//       const payload = formatMedicalForApi(form);
//       if (isExisting) {
//         await updateMedical(numero, payload);
//       } else {
//         await createMedical(numero, payload);
//         setIsExisting(true);
//       }
//       setSavedForm(form);
//       setIsEditing(false);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return {
//     form,
//     isExisting,
//     isEditing,
//     loading,
//     saving,
//     error,
//     handleToggle,
//     handleChange,
//     startEditing,
//     cancelEditing,
//     save,
//   };
// }

import { useState, useEffect, useCallback, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { toast } from "react-toastify";
import { getMedical, createMedical, updateMedical } from "../../../../services/antecedentsService.jsx";
import { formatMedicalFromApi, formatMedicalForApi } from "./medicalHelpers";
import { MEDICAL_INITIAL_STATE } from "./medicalConstants";

export default function useMedical(numero) {
  const [form, setForm] = useState(MEDICAL_INITIAL_STATE);
  const [savedForm, setSavedForm] = useState(MEDICAL_INITIAL_STATE);
  const [isExisting, setIsExisting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isHandlingBlock = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMedical(numero);
        if (data) {
          const formatted = formatMedicalFromApi(data);
          setForm(formatted);
          setSavedForm(formatted);
          setIsExisting(true);
          setIsEditing(false);
        } else {
          setForm(MEDICAL_INITIAL_STATE);
          setSavedForm(MEDICAL_INITIAL_STATE);
          setIsExisting(false);
          setIsEditing(true);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numero]);

  const isDirty =
    isEditing &&
    JSON.stringify(form) !== JSON.stringify(savedForm);

  const saveQuiet = useCallback(async () => {
    try {
      setSaving(true);
      const payload = formatMedicalForApi(form);
      if (isExisting) {
        await updateMedical(numero, payload);
      } else {
        await createMedical(numero, payload);
        setIsExisting(true);
      }
      setSavedForm(form);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }, [form, isExisting, numero]);

  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (isHandlingBlock.current) return;
    isHandlingBlock.current = true;

    const isAntecedentsNav = blocker.location.pathname.includes("/antecedents/");

    if (isAntecedentsNav) {
      (async () => {
        try {
          await saveQuiet();
          toast.success("Données sauvegardées automatiquement.");
        } catch {
          toast.error("Erreur lors de la sauvegarde automatique.");
        } finally {
          blocker.proceed();
          isHandlingBlock.current = false;
        }
      })();
    } else {
      const confirmed = window.confirm(
        "Vous avez des modifications non sauvegardées. Voulez-vous enregistrer avant de partir ?"
      );
      if (confirmed) {
        (async () => {
          try {
            await saveQuiet();
            toast.success("Données sauvegardées.");
          } catch {
            toast.error("Erreur lors de la sauvegarde.");
          } finally {
            blocker.proceed();
            isHandlingBlock.current = false;
          }
        })();
      } else {
        blocker.reset();
        isHandlingBlock.current = false;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);

  const handleToggle = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    setForm(savedForm);
    setIsEditing(false);
  };

  const save = async () => {
    try {
      setSaving(true);
      const payload = formatMedicalForApi(form);
      if (isExisting) {
        await updateMedical(numero, payload);
      } else {
        await createMedical(numero, payload);
        setIsExisting(true);
      }
      setSavedForm(form);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    isExisting,
    isEditing,
    loading,
    saving,
    error,
    handleToggle,
    handleChange,
    startEditing,
    cancelEditing,
    save,
  };
}