import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  getAuditLogDetails,
  getPatientAuditLogs,
  getGlobalAuditLogs,        // nouveau service
} from "../../services/auditService";
import { ACTIONS, DEFAULT_LIMIT } from "./constante";
import { buildDiffRows, getActionModule } from "./helpers";
import {
  isNumeroValid,
  validateNumeroYear,
} from "../../../medecin/pages/workspace/Profil/profileHelpers";

export const useAuditLogsPageLogic = () => {
  const [patientNumeroInput, setPatientNumeroInput] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [limit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const numeroError = useMemo(() => {
    if (!patientNumeroInput) return null;
    if (!isNumeroValid(patientNumeroInput)) {
      return "Format invalide : ex. 0001-2025";
    }
    return validateNumeroYear(patientNumeroInput);
  }, [patientNumeroInput]);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const modules = useMemo(() => {
    const set = new Set();
    ACTIONS.forEach((a) => set.add(getActionModule(a)));
    return Array.from(set).sort();
  }, []);

  const actionsForModule = useMemo(() => {
    if (!module) return ACTIONS;
    return ACTIONS.filter((a) => getActionModule(a) === module);
  }, [module]);

  const diffRows = useMemo(() => {
    if (!details) return [];
    return buildDiffRows(details.old_data, details.new_data);
  }, [details]);

  // ---------- Chargement des logs globaux ----------
  const fetchGlobalLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGlobalAuditLogs({
        module: module || undefined,
        action: action || undefined,
        from: from || undefined,
        to: to || undefined,
        limit,
        offset,
      });
      setSelectedPatient(null);        // important : plus de patient sélectionné
      setLogs(data.logs || []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setLogs([]);
      setTotal(0);
      toast.error(err?.message || "Erreur chargement des logs");
    } finally {
      setLoading(false);
    }
  }, [module, action, from, to, limit, offset]);

  // ---------- Chargement des logs d'un patient (existant) ----------
  const fetchPatientLogs = useCallback(async (numero) => {
    setLoading(true);
    try {
      const data = await getPatientAuditLogs(numero, {
        module: module || undefined,
        action: action || undefined,
        from: from || undefined,
        to: to || undefined,
        limit,
        offset,
      });
      setSelectedPatient(data.patient || null);
      setLogs(data.logs || []);
      setTotal(data.total ?? 0);
    } catch (err) {
      setSelectedPatient(null);
      setLogs([]);
      setTotal(0);
      toast.error(err?.message || "Erreur chargement audit patient");
    } finally {
      setLoading(false);
    }
  }, [module, action, from, to, limit, offset]);

  // Effet de montage : charger tous les logs au démarrage
  useEffect(() => {
    fetchGlobalLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ne dépend de rien, exécuté une fois

  // Effet pour recharger les logs quand les filtres (module, action, dates, pagination) changent
  // Mais seulement si aucun patient n'est sélectionné
  useEffect(() => {
    if (!selectedPatient?.numero) {
      fetchGlobalLogs();
    }
  }, [module, action, from, to, offset, selectedPatient, fetchGlobalLogs]);

  // Effet pour recharger les logs patient quand le patient change
  useEffect(() => {
    if (selectedPatient?.numero) {
      fetchPatientLogs(selectedPatient.numero);
    }
  }, [selectedPatient?.numero, fetchPatientLogs]);

  // Recherche par numéro patient
  const onSearch = useCallback(async (e) => {
    e.preventDefault();
    const numero = patientNumeroInput.trim();

    if (!numero) {
      toast.info("Veuillez entrer le numéro du patient");
      return;
    }
    if (numeroError) {
      toast.error(numeroError);
      return;
    }

    setOffset(0);
    // On simule la sélection d'un patient (le fetchPatientLogs sera déclenché par l'effet)
    setSelectedPatient({ numero });
  }, [patientNumeroInput, numeroError]);

  const openDetails = useCallback(async (id) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    setDetails(null);
    try {
      const data = await getAuditLogDetails(id);
      setDetails(data.log || null);
    } catch (err) {
      toast.error(err?.message || "Erreur chargement details");
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsOpen(false);
    setDetails(null);
  }, []);

  // Réinitialisation complète
  const onReset = useCallback(() => {
    setPatientNumeroInput("");
    setSelectedPatient(null);
    setLogs([]);
    setTotal(0);
    setOffset(0);
    setModule("");
    setAction("");
    setFrom("");
    setTo("");
    // Le rechargement des logs globaux se fera via l'effet (selectedPatient = null)
  }, []);

  const next = useCallback(() => {
    if (page < totalPages) setOffset((v) => v + limit);
  }, [limit, page, totalPages]);

  const prev = useCallback(() => {
    if (page > 1) setOffset((v) => Math.max(0, v - limit));
  }, [limit, page]);

  // Gestion de la touche Escape pour fermer les détails
  useEffect(() => {
    if (!detailsOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeDetails();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detailsOpen, closeDetails]);

  return {
    patientNumeroInput,
    setPatientNumeroInput,
    selectedPatient,
    module,
    setModule,
    action,
    setAction,
    from,
    setFrom,
    to,
    setTo,
    loading,
    logs,
    total,
    page,
    totalPages,
    detailsOpen,
    detailsLoading,
    details,
    diffRows,
    modules,
    actionsForModule,
    numeroError,
    onSearch,
    openDetails,
    closeDetails,
    onReset,
    next,
    prev,
    setOffset,
  };
};