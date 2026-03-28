import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  getAuditLogDetails,
  getPatientAuditLogs,
} from "../../services/auditService";
import { ACTIONS, DEFAULT_LIMIT } from "./constante";
import { buildDiffRows, getActionModule } from "./helpers";

// 🔥 idèalement déplacer vers shared/helpers
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

  // 🔥 VALIDATION CENTRALISÉE
  const numeroError = useMemo(() => {
    if (!patientNumeroInput) return null;

    if (!isNumeroValid(patientNumeroInput)) {
      return "Format invalide : ex. 0001-2025";
    }

    return validateNumeroYear(patientNumeroInput);
  }, [patientNumeroInput]);

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );

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

  const fetchPatient = useCallback(
    async (numero) => {
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
    },
    [action, from, limit, module, offset, to],
  );

  useEffect(() => {
    if (selectedPatient?.numero) {
      fetchPatient(selectedPatient.numero);
    }
  }, [selectedPatient?.numero, fetchPatient]);

  const closeDetails = useCallback(() => {
    setDetailsOpen(false);
    setDetails(null);
  }, []);

  useEffect(() => {
    if (!detailsOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeDetails();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detailsOpen, closeDetails]);

  
  const onSearch = useCallback(
    
    async (e) => {
      console.log("🔥 onSearch déclenché");
      e.preventDefault();

      const numero = patientNumeroInput.trim();

      if (!numero) {
        toast.info("Veuillez entrer le numero du patient");
        return;
      }

      if (numeroError) {
        toast.error(numeroError);
        return;
      }

      setOffset(0);
      await fetchPatient(numero);
    },
    [fetchPatient, patientNumeroInput, numeroError],
  );

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
  }, []);

  const next = useCallback(() => {
    if (page < totalPages) setOffset((v) => v + limit);
  }, [limit, page, totalPages]);

  const prev = useCallback(() => {
    if (page > 1) setOffset((v) => Math.max(0, v - limit));
  }, [limit, page]);

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