// import { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";
// import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
// import {
//   getResultatsByNumeroDossier,
//   createResultat,
//   updateResultat,
// } from "../../../services/resultatBiologiqueService";
// import { getBilansByNumeroDossier } from "../../../services/bilanExamenService";
// import { buildInitialForm, getChampActifs } from "../../../shared/utils/bilanResultatsMap";
// import { MESSAGES, SECTION_DATE_KEY } from "./ResultatsbiologiquesConstants";
// import { clearFieldError } from "../../../../../shared/components/Forms/FieldLabel/clearFieldError";
// import {
//   fileToBase64,
//   collectGenotypageUrls,
//   deduplicateGenotypageUrls,
//   normalizeGenotypageUrls,
//   formatGenotypageValue,
// } from "./resultatsBiologiquesHelpers";

// // ── Validation frontend pour champs numériques + dates ─────────────────────────────
// const validateNumericFields = (formData, champsActifs) => {
//   const errors = {};

//   champsActifs.forEach(({champs }) => {
//     champs.forEach(({ key, type, label }) => {
//       if (type === "number") {
//         const value = formData[key];

//         // Vérifier si le champ est vide
//         if (value === "" || value === null || value === undefined) {
//           errors[key] = `${label} est obligatoire`;
//         }
//         // Vérifier si le champ est négatif
//         else if (Number(value) < 0) {
//           errors[key] = `${label} ne peut pas être négatif`;
//         }
//       }
//     });
//   });

//   // ── Validation requise pour TOUTES les dates des sections actives ──
//   champsActifs.forEach(({ _key }) => {
//     const dateKey = SECTION_DATE_KEY[_key];
//     if (dateKey) {
//       const dateValue = formData[dateKey];
//       if (!dateValue || dateValue === "") {
//         errors[dateKey] = "La date est obligatoire";
//       }
//     }
//   });

//   return errors;
// };

// export function useResultatsBiologiquesLogic() {
//   const { numero } = useParams();

//   // ── Données bilans (table affichée dans l'historique) ─────────────────────
//   const [bilans,setBilans]        = useState([]);
//   // ── Données résultats (liés aux bilans par bilan_id) ─────────────────────
//   const [resultats,     setResultats]     = useState([]);
//   // ── Bilan actif sélectionné pour la saisie ────────────────────────────────
//   const [bilanActif,    setBilanActif]    = useState(null);
//   const [champsActifs,  setChampsActifs]  = useState([]);

//   const [loading,      setLoading]      = useState(true);
//   const [saving,       setSaving]       = useState(false);
//   const [showForm,     setShowForm]     = useState(false);
//   const [showHistory,  setShowHistory]  = useState(true);
//   const [isModifying,  setIsModifying]  = useState(false);
//   const [editingId,    setEditingId]    = useState(null);
//   const [detailItem,   setDetailItem]   = useState(null);
//   const [formData,     setFormData]     = useState({});
//   const [errors,       setErrors]       = useState({});

//   // ── Chargement initial ────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!numero) return;
//     const fetchAll = async () => {
//       try {
//         setLoading(true);
//         const [resBilans, resResultats] = await Promise.all([ // appel parallèle
//           getBilansByNumeroDossier(numero),
//           getResultatsByNumeroDossier(numero),
//         ]);
//         setBilans(resBilans.bilans || []);
//         setResultats(resResultats.resultats || []);
//       } catch (err) {
//         toast.error(err?.message || MESSAGES.erreurChargement);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, [numero]);

//   // ── Helper : résultat lié à un bilan donné ────────────────────────────────
//   // Retourne le resultat dont bilan_id === bilan.id, ou null.
//   const getResultatForBilan = (bilan) =>
//     resultats.find((r) => r.bilan_id === bilan.id) || null;

//   // ── Reset formulaire ──────────────────────────────────────────────────────
//   const resetForm = () => {
//     setFormData(buildInitialForm(bilanActif));
//     setIsModifying(false);
//     setEditingId(null);
//   };

//   const closeForm = () => {
//     resetForm();
//     setShowForm(false);
//     setBilanActif(null);
//     setChampsActifs([]);
//   };

//   const field = (key) => (e) => {
//     setFormData((prev) => ({ ...prev, [key]: e.target.value }));
//     clearFieldError(key, setErrors);
//   };


//   const openCreateForBilan = (bilan) => { // Cas CRÉATION : on clique sur "Ajouter résultat" depuis un bilan de la liste
//     const actifs = getChampActifs(bilan); // détermine les champs à afficher selon le type de bilan
//     setBilanActif(bilan); //crée formData avec des valeurs vides pour ces champs
//     setChampsActifs(actifs);
//     setDetailItem(null);
//     setIsModifying(false);
//     setEditingId(null);
//     setFormData(buildInitialForm(bilan));
//     setShowForm(true);
//   };

//   // ── Ouvrir modification du résultat d'un bilan ───────────────────────────
//   const openEdit = async (resultat, bilan) => { // Cas MODIFICATION : on clique sur le résultat d'un bilan dans la liste
//     const actifs = getChampActifs(bilan); //détermine les champs à afficher selon le type de bilan
//     setBilanActif(bilan);
//     setChampsActifs(actifs);
//     setDetailItem(null);
//     setIsModifying(true);
//     setEditingId(resultat.id);

//     const prefilled = {}; //chaque champ prend la valeur existante
//     actifs.forEach(({ _key, champs }) => {
//       champs.forEach(({ key }) => { prefilled[key] = resultat[key] ?? ""; });
//       const dateKey = `date_${_key}`;
//       prefilled[dateKey] = resultat[dateKey] ? resultat[dateKey].slice(0, 10) : "";
//     });
//     prefilled.observations  = resultat.observations ?? "";
//     prefilled.date_resultat = resultat.date_resultat
//       ? resultat.date_resultat.slice(0, 10)
//       : new Date().toISOString().slice(0, 10);

//     setFormData(prefilled); //pré-remplit le formulaire avec les données du résultat existant
//     setShowForm(true);
//     toast.info(MESSAGES.modeModif);
//   };

//   // ── Afficher le détail du résultat d'un bilan ────────────────────────────
//   const handleShowDetails = (resultat, bilan) => {
//     const actifs = getChampActifs(bilan);
//     setBilanActif(bilan);
//     setChampsActifs(actifs);
//     setShowForm(false);
//     resetForm();
//     setDetailItem(resultat);
//     toast.info(MESSAGES.modeDetails);
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const ok = await confirmAction(
//       isModifying ? MESSAGES.confirmerModif : MESSAGES.confirmerCreation,
//       MESSAGES.confirmerModifSub,
//     );
//     if (!ok) return;

//     try {
//       setSaving(true);
      
//       // ── Validation frontend ────────────────────────────────────────────────
//       const validationErrors = validateNumericFields(formData, champsActifs);
//       if (Object.keys(validationErrors).length > 0) {
//         setErrors(validationErrors);
//         toast.warning("Veuillez corriger les erreurs dans le formulaire");
//         setSaving(false);
//         return;
//       }

//       setErrors({}); // reset erreurs si validation frontend OK

//       if (isModifying && editingId) {
//         const res = await updateResultat(editingId, formData);
//         setResultats((prev) =>
//           prev.map((r) => (r.id === editingId ? res.resultat : r))
//         );
//         toast.success(MESSAGES.successModif);
//       } else {
//         const res = await createResultat({
//           ...formData,
//           numero_dossier: numero,
//           bilan_id:       bilanActif?.id || null,
//         });
//         setResultats((prev) => [res.resultat, ...prev]);
//         toast.success(MESSAGES.successCreation);
//       }
//       closeForm();
//     } catch (err) {
//       // Gestion des erreurs du backend
//       if (err?.errors && Array.isArray(err.errors)) {
//         const formattedErrors = {};
//         err.errors.forEach((e) => {
//           formattedErrors[e.field] = e.message;
//         });
//         setErrors(formattedErrors);
//       } else {
//         await alertError(err?.response?.data?.message || MESSAGES.erreurEnregistrement);
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ── Navigation & génotypage ─────────────────────────────────────────────────
//   const navigate  = useNavigate();
//   const location  = useLocation();
//   const fileInputRef = useRef(null);
//   const [genotypageLocalUrls, setGenotypageLocalUrls] = useState([]);
//   const genotypageSectionRef = useRef(null);

//   const basePath = `/medecin/patient/${numero}/workspace/biologie`;

//   // Restaurer le draft génotypage au retour de la page génotypage
//   useEffect(() => {
//     const restoredUrls = location.state?.restoredGenotypage;
//     const draftedValue = sessionStorage.getItem("resultatsBiologiquesGenotypage");

//     if (restoredUrls && restoredUrls.length > 0) {
//       const rawValue = Array.isArray(restoredUrls) ? formatGenotypageValue(restoredUrls) : restoredUrls;
//       setFormData((prev) => ({ ...prev, genotypage_file_url: rawValue }));
//       setGenotypageLocalUrls(Array.isArray(restoredUrls) ? restoredUrls : [restoredUrls]);
//     } else if (draftedValue) {
//       setFormData((prev) => ({ ...prev, genotypage_file_url: draftedValue }));
//       setGenotypageLocalUrls(normalizeGenotypageUrls(draftedValue));
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.state?.restoredGenotypage]);

//   // Naviguer vers la page génotypage (toujours en lecture seule depuis ResultatsBiologiques)
//   const openGenotypagePage = () => {
//     const currentUrls = normalizeGenotypageUrls(formData.genotypage_file_url).length > 0
//       ? normalizeGenotypageUrls(formData.genotypage_file_url)
//       : genotypageLocalUrls;
//     const urls = collectGenotypageUrls(resultats, currentUrls);

//     if (currentUrls.length > 0) {
//       sessionStorage.setItem("resultatsBiologiquesGenotypage", formatGenotypageValue(currentUrls));
//     } else {
//       sessionStorage.removeItem("resultatsBiologiquesGenotypage");
//     }

//     navigate(`${basePath}/genotypage`, {
//       state: {
//         fromBiologie: true,
//         scanUrl: urls,
//         draftGenotypage: currentUrls,
//       },
//     });
//   };

//   const openGenotypagePicker = () => fileInputRef.current?.click();

//   const handleGenotypageFileChange = async (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;

//     const MAX_TOTAL  = 40 * 1024 * 1024;
//     const MAX_SINGLE = 15 * 1024 * 1024;
//     const totalSize  = files.reduce((sum, f) => sum + f.size, 0);

//     if (totalSize > MAX_TOTAL) {
//       toast.error(`Taille totale dépasse 40MB (${(totalSize / (1024 * 1024)).toFixed(1)}MB).`);
//       e.target.value = "";
//       return;
//     }
//     const oversized = files.filter((f) => f.size > MAX_SINGLE);
//     if (oversized.length > 0) {
//       toast.error(`Certains fichiers dépassent 15MB : ${oversized.map((f) => f.name).join(", ")}`);
//       e.target.value = "";
//       return;
//     }

//     try {
//       const base64s    = await Promise.all(files.map(fileToBase64));
//       const existing   = normalizeGenotypageUrls(formData.genotypage_file_url);
//       const allUrls    = deduplicateGenotypageUrls([...existing, ...base64s]);
//       setGenotypageLocalUrls(allUrls);
//       setFormData((prev) => ({ ...prev, genotypage_file_url: formatGenotypageValue(allUrls) }));
//       toast.success(`${files.length} fichier(s) génotypage ajouté(s).`);
//     } catch (err) {
//       toast.error(err?.message || "Erreur lors de la lecture des fichiers.");
//     } finally {
//       e.target.value = "";
//     }
//   };

//   return {
//     numero,
//     // listes
//     bilans,
//     resultats,
//     champsActifs,
//     bilanActif,
//     // état UI
//     loading, saving,
//     showForm, showHistory, setShowHistory,
//     isModifying,
//     detailItem, setDetailItem,
//     formData, field,
//     errors, setErrors,
//     // helpers
//     getResultatForBilan,
//     // actions
//     openCreateForBilan,
//     openEdit,
//     closeForm,
//     handleShowDetails,
//     handleSubmit,
//     // génotypage
//     fileInputRef,
//     genotypageSectionRef,
//     genotypageLocalUrls,
//     openGenotypagePage,
//     openGenotypagePicker,
//     handleGenotypageFileChange,
//   };
// }


import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import {
  getResultatsByNumeroDossier,
  createResultat,
  updateResultat,
} from "../../../services/resultatBiologiqueService";
import { getBilansByNumeroDossier } from "../../../services/bilanExamenService";
import { buildInitialForm, getChampActifs } from "../../../shared/utils/bilanResultatsMap";
import { MESSAGES, SECTION_DATE_KEY } from "./ResultatsbiologiquesConstants";
import { clearFieldError } from "../../../../../shared/components/Forms/FieldLabel/clearFieldError";
import {
  fileToBase64,
  collectGenotypageUrls,
  deduplicateGenotypageUrls,
  normalizeGenotypageUrls,
  formatGenotypageValue,
} from "./resultatsBiologiquesHelpers";

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION FRONTEND
// - Ignore entièrement les sections marquées NF (Non Fait)
// - Vérifie les champs numériques obligatoires et négatifs
// - Vérifie la date de chaque section active (non NF)
// ─────────────────────────────────────────────────────────────────────────────
const validateNumericFields = (formData, champsActifs, nfSections) => {
  const errors = {};

  champsActifs.forEach((section) => {
    // ── Section NF → on ignore tous ses champs et sa date ────────────────
    if (nfSections.has(section._key)) return;

    // ── Validation champs numériques ──────────────────────────────────────
    section.champs.forEach(({ key, type, label }) => {
      if (type === "number") {
        const value = formData[key];

        if (value === "" || value === null || value === undefined) {
          errors[key] = `${label} est obligatoire`;
        } else if (Number(value) < 0) {
          errors[key] = `${label} ne peut pas être négatif`;
        }
      }
    });

    // ── Validation date de section (obligatoire si section non NF) ────────
    const dateKey = SECTION_DATE_KEY[section._key];
    if (dateKey) {
      const dateValue = formData[dateKey];
      if (!dateValue || dateValue === "") {
        errors[dateKey] = "La date est obligatoire";
      }
    }
  });

  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export function useResultatsBiologiquesLogic() {
  const { numero } = useParams();

  // ── Données bilans et résultats ───────────────────────────────────────────
  const [bilans,        setBilans]        = useState([]);
  const [resultats,     setResultats]     = useState([]);
  const [bilanActif,    setBilanActif]    = useState(null);
  const [champsActifs,  setChampsActifs]  = useState([]);

  // ── État UI ───────────────────────────────────────────────────────────────
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [showHistory,  setShowHistory]  = useState(true);
  const [isModifying,  setIsModifying]  = useState(false);
  const [editingId,    setEditingId]    = useState(null);
  const [detailItem,   setDetailItem]   = useState(null);
  const [formData,     setFormData]     = useState({});
  const [errors,       setErrors]       = useState({});

  // ── Sections marquées "Non Fait" (NF) ────────────────────────────────────
  // Contient les _key des sections dont le bilan n'a pas été effectué.
  // Une section NF est ignorée à la validation et grisée dans l'UI.
  const [nfSections, setNfSections] = useState(new Set());

  // ── Chargement initial des bilans et résultats ────────────────────────────
  useEffect(() => {
    if (!numero) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [resBilans, resResultats] = await Promise.all([
          getBilansByNumeroDossier(numero),
          getResultatsByNumeroDossier(numero),
        ]);
        setBilans(resBilans.bilans || []);
        setResultats(resResultats.resultats || []);
      } catch (err) {
        toast.error(err?.message || MESSAGES.erreurChargement);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [numero]);

  // ── Retourne le résultat lié à un bilan donné (ou null) ───────────────────
  const getResultatForBilan = (bilan) =>
    resultats.find((r) => r.bilan_id === bilan.id) || null;

  // ── Reset du formulaire et de l'état NF ───────────────────────────────────
  const resetForm = () => {
    setFormData(buildInitialForm(bilanActif));
    setIsModifying(false);
    setEditingId(null);
    setNfSections(new Set()); // ← reset sections NF à chaque réinitialisation
  };

  // ── Fermer le formulaire ──────────────────────────────────────────────────
  const closeForm = () => {
    resetForm();
    setShowForm(false);
    setBilanActif(null);
    setChampsActifs([]);
    setNfSections(new Set()); // ← sécurité : reset même si resetForm n'est pas appelé
  };

  // ── Handler générique de champ : met à jour formData et efface l'erreur ───
  const field = (key) => (e) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    clearFieldError(key, setErrors);
  };

  // ── Toggle NF d'une section ───────────────────────────────────────────────
  // Ajoute ou retire la section du Set nfSections.
  // Efface également l'erreur de date de la section concernée.
  const toggleSectionNF = (sectionKey) => {
    setNfSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) {
        next.delete(sectionKey);
      } else {
        next.add(sectionKey);
        // Effacer l'erreur de date si elle existait pour cette section
        const dateKey = SECTION_DATE_KEY[sectionKey];
        if (dateKey) {
          clearFieldError(dateKey, setErrors);
        }
      }
      return next;
    });
  };

  // ── Ouvrir le formulaire en mode CRÉATION ─────────────────────────────────
  const openCreateForBilan = (bilan) => {
    const actifs = getChampActifs(bilan);
    setBilanActif(bilan);
    setChampsActifs(actifs);
    setDetailItem(null);
    setIsModifying(false);
    setEditingId(null);
    setFormData(buildInitialForm(bilan));
    setNfSections(new Set()); // ← reset NF pour une nouvelle saisie
    setShowForm(true);
  };

  // ── Ouvrir le formulaire en mode MODIFICATION ─────────────────────────────
  const openEdit = async (resultat, bilan) => {
    const actifs = getChampActifs(bilan);
    setBilanActif(bilan);
    setChampsActifs(actifs);
    setDetailItem(null);
    setIsModifying(true);
    setEditingId(resultat.id);

    // Pré-remplir chaque champ avec la valeur existante
    const prefilled = {};
    actifs.forEach(({ _key, champs }) => {
      champs.forEach(({ key }) => { prefilled[key] = resultat[key] ?? ""; });
      const dateKey = `date_${_key}`;
      prefilled[dateKey] = resultat[dateKey] ? resultat[dateKey].slice(0, 10) : "";
    });
    prefilled.observations  = resultat.observations ?? "";
    prefilled.date_resultat = resultat.date_resultat
      ? resultat.date_resultat.slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    setFormData(prefilled);
    setNfSections(new Set()); // ← reset NF (pas de persistance NF en DB pour l'instant)
    setShowForm(true);
    toast.info(MESSAGES.modeModif);
  };

  // ── Afficher la vue détail (lecture seule) ────────────────────────────────
  const handleShowDetails = (resultat, bilan) => {
    const actifs = getChampActifs(bilan);
    setBilanActif(bilan);
    setChampsActifs(actifs);
    setShowForm(false);
    resetForm();
    setDetailItem(resultat);
    toast.info(MESSAGES.modeDetails);
  };

  // ── Soumission du formulaire ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await confirmAction(
      isModifying ? MESSAGES.confirmerModif : MESSAGES.confirmerCreation,
      MESSAGES.confirmerModifSub,
    );
    if (!ok) return;

    try {
      setSaving(true);

      // Validation frontend — les sections NF sont ignorées
      const validationErrors = validateNumericFields(formData, champsActifs, nfSections);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.warning("Veuillez corriger les erreurs dans le formulaire");
        setSaving(false);
        return;
      }

      setErrors({});

      if (isModifying && editingId) {
        const res = await updateResultat(editingId, formData);
        setResultats((prev) =>
          prev.map((r) => (r.id === editingId ? res.resultat : r))
        );
        toast.success(MESSAGES.successModif);
      } else {
        const res = await createResultat({
          ...formData,
          numero_dossier: numero,
          bilan_id:       bilanActif?.id || null,
        });
        setResultats((prev) => [res.resultat, ...prev]);
        toast.success(MESSAGES.successCreation);
      }
      closeForm();
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors)) {
        const formattedErrors = {};
        err.errors.forEach((e) => {
          formattedErrors[e.field] = e.message;
        });
        setErrors(formattedErrors);
      } else {
        await alertError(err?.response?.data?.message || MESSAGES.erreurEnregistrement);
      }
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // NAVIGATION & GÉNOTYPAGE
  // ─────────────────────────────────────────────────────────────────────────
  const navigate  = useNavigate();
  const location  = useLocation();
  const fileInputRef          = useRef(null);
  const genotypageSectionRef  = useRef(null);
  const [genotypageLocalUrls, setGenotypageLocalUrls] = useState([]);

  const basePath = `/medecin/patient/${numero}/workspace/biologie`;

  // Restaurer le draft génotypage au retour de la page génotypage
  useEffect(() => {
    const restoredUrls = location.state?.restoredGenotypage;
    const draftedValue = sessionStorage.getItem("resultatsBiologiquesGenotypage");

    if (restoredUrls && restoredUrls.length > 0) {
      const rawValue = Array.isArray(restoredUrls)
        ? formatGenotypageValue(restoredUrls)
        : restoredUrls;
      setFormData((prev) => ({ ...prev, genotypage_file_url: rawValue }));
      setGenotypageLocalUrls(
        Array.isArray(restoredUrls) ? restoredUrls : [restoredUrls]
      );
    } else if (draftedValue) {
      setFormData((prev) => ({ ...prev, genotypage_file_url: draftedValue }));
      setGenotypageLocalUrls(normalizeGenotypageUrls(draftedValue));
    }
  }, [location.state?.restoredGenotypage]);

  // Naviguer vers la page génotypage (lecture seule depuis ResultatsBiologiques)
  const openGenotypagePage = () => {
    const currentUrls =
      normalizeGenotypageUrls(formData.genotypage_file_url).length > 0
        ? normalizeGenotypageUrls(formData.genotypage_file_url)
        : genotypageLocalUrls;
    const urls = collectGenotypageUrls(resultats, currentUrls);

    if (currentUrls.length > 0) {
      sessionStorage.setItem(
        "resultatsBiologiquesGenotypage",
        formatGenotypageValue(currentUrls)
      );
    } else {
      sessionStorage.removeItem("resultatsBiologiquesGenotypage");
    }

    navigate(`${basePath}/genotypage`, {
      state: {
        fromBiologie:   true,
        scanUrl:        urls,
        draftGenotypage: currentUrls,
      },
    });
  };

  const openGenotypagePicker = () => fileInputRef.current?.click();

  const handleGenotypageFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const MAX_TOTAL  = 40 * 1024 * 1024;
    const MAX_SINGLE = 15 * 1024 * 1024;
    const totalSize  = files.reduce((sum, f) => sum + f.size, 0);

    if (totalSize > MAX_TOTAL) {
      toast.error(
        `Taille totale dépasse 40MB (${(totalSize / (1024 * 1024)).toFixed(1)}MB).`
      );
      e.target.value = "";
      return;
    }
    const oversized = files.filter((f) => f.size > MAX_SINGLE);
    if (oversized.length > 0) {
      toast.error(
        `Certains fichiers dépassent 15MB : ${oversized.map((f) => f.name).join(", ")}`
      );
      e.target.value = "";
      return;
    }

    try {
      const base64s  = await Promise.all(files.map(fileToBase64));
      const existing = normalizeGenotypageUrls(formData.genotypage_file_url);
      const allUrls  = deduplicateGenotypageUrls([...existing, ...base64s]);
      setGenotypageLocalUrls(allUrls);
      setFormData((prev) => ({
        ...prev,
        genotypage_file_url: formatGenotypageValue(allUrls),
      }));
      toast.success(`${files.length} fichier(s) génotypage ajouté(s).`);
    } catch (err) {
      toast.error(err?.message || "Erreur lors de la lecture des fichiers.");
    } finally {
      e.target.value = "";
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORTS DU HOOK
  // ─────────────────────────────────────────────────────────────────────────
  return {
    numero,
    // listes
    bilans,
    resultats,
    champsActifs,
    bilanActif,
    // état UI
    loading, saving,
    showForm, showHistory, setShowHistory,
    isModifying,
    detailItem, setDetailItem,
    formData, field,
    errors, setErrors,
    // NF (Non Fait) par section
    nfSections,
    toggleSectionNF,
    // helpers
    getResultatForBilan,
    // actions formulaire
    openCreateForBilan,
    openEdit,
    closeForm,
    handleShowDetails,
    handleSubmit,
    // génotypage
    fileInputRef,
    genotypageSectionRef,
    genotypageLocalUrls,
    openGenotypagePage,
    openGenotypagePicker,
    handleGenotypageFileChange,
  };
}