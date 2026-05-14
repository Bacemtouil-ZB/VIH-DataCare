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
  isValidGenotypageFile,
} from "./resultatsBiologiquesHelpers";


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
      const dateKey = SECTION_DATE_KEY[sectionKey];
      if (dateKey) clearFieldError(dateKey, setErrors);

      // ✅ NOUVEAU : reset visuel des champs de la section cochée NF
      const section = champsActifs.find((s) => s._key === sectionKey);
      if (section) {
        setFormData((prev) => {
          const updated = { ...prev };
          section.champs.forEach(({ key }) => { updated[key] = ""; });
          if (dateKey) updated[dateKey] = "";
          // Si la section NF est génotypage, vider aussi l'URL
          updated.genotypage_file_url = "";
          setGenotypageLocalUrls([]);
          return updated;
        });
      }
    }
    return next;
  });
};

  // ── Ouvrir le formulaire en mode CRÉATION, "Saisir résultat", ─────────────────────────────────
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



  // ── Convertit DD/MM/YYYY → YYYY-MM-DD si nécessaire ──────────────────────
const normalizeDates = (data) => {
  const normalized = { ...data };
  Object.keys(normalized).forEach((key) => {
    const value = normalized[key];
    if (typeof value === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split("/");
      normalized[key] = `${year}-${month}-${day}`;
    }
  });
  return normalized;
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

       // ✅ NOUVEAU : vider les champs des sections NF avant envoi
    let cleanedData = { ...formData };
    champsActifs.forEach((section) => {
      if (nfSections.has(section._key)) {
        // Vider tous les champs de la section
        section.champs.forEach(({ key }) => {
          cleanedData[key] = null;
        });
        // Vider la date de la section
        const dateKey = SECTION_DATE_KEY[section._key];
        if (dateKey) cleanedData[dateKey] = null;
        // Vider le génotypage si la section NF contient genotypage_file_url
        if (Object.keys(cleanedData).includes("genotypage_file_url")) {
          cleanedData.genotypage_file_url = null;
        }
      }
    });

    const normalizedData = normalizeDates(formData); // ← normalisation ici

    if (isModifying && editingId) {
      const res = await updateResultat(editingId, normalizedData); // ← appliqué
      setResultats((prev) =>
        prev.map((r) => (r.id === editingId ? res.resultat : r))
      );
      toast.success(MESSAGES.successModif);
    } else {
      const res = await createResultat({
        ...normalizedData,              // ← appliqué
        numero_dossier: numero,
        bilan_id: bilanActif?.id || null,
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
  //explorateur de fichiers
  const openGenotypagePicker = () => fileInputRef.current?.click();

  const handleGenotypageFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const invalidFiles = files.filter((file) => !isValidGenotypageFile(file));
    const validFiles = files.filter((file) => isValidGenotypageFile(file));

    if (invalidFiles.length > 0) {
      toast.error(
        `Génotypage : Format invalide. Formats acceptés : images (JPG, PNG) et PDF.`
      );
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    const MAX_TOTAL  = 35 * 1024 * 1024;   // 35MB total
    const MAX_SINGLE = 12 * 1024 * 1024;   // 12MB par fichier
    const totalSize  = validFiles.reduce((sum, f) => sum + f.size, 0);

    if (totalSize > MAX_TOTAL) {
      const totalMB = (totalSize / (1024 * 1024)).toFixed(1);
      toast.error(
        `Génotpage : Taille totale dépasse 35MB . Veuillez sélectionner moins de fichiers ou des fichiers plus petits.`
      );
      e.target.value = "";
      return;
    }
    
    const oversized = validFiles.filter((f) => f.size > MAX_SINGLE);
    if (oversized.length > 0) {
      const fileList = oversized.map((f) => {
        const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
        return `${f.name} (${sizeMB}MB)`;
      }).join(", ");
      toast.error(
        `Génotypage : Certains fichiers dépassent 12MB `
      );
      e.target.value = "";
      return;
    }

    try {
      const base64s  = await Promise.all(validFiles.map(fileToBase64));
      const existing = normalizeGenotypageUrls(formData.genotypage_file_url);
      const allUrls  = deduplicateGenotypageUrls([...existing, ...base64s]);
      setGenotypageLocalUrls(allUrls);
      setFormData((prev) => ({
        ...prev,
        genotypage_file_url: formatGenotypageValue(allUrls),
      }));
      toast.success(` ${validFiles.length} fichier(s) génotypage ajouté(s) avec succès.`);
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
