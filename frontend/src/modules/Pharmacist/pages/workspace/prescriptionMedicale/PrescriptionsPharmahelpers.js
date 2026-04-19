import {
  STATUT_PATIENT_BADGE_MAP,
  PRESCRIPTION_BADGE_MAP,
} from "./prescriptionsPharmaConstants";

export const calculatePreviewDate = (periodeJours, dateDelivrance = new Date()) => {
  const jours = Number.parseInt(periodeJours, 10);
  if (!jours || jours <= 0) return null;
  const base = new Date(dateDelivrance);
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + jours);
  return base;
};

export const daysUntil = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
};

export const getRdvBarWidth = (days) => {
  if (days < 0)   return { width: 100, cls: "bar-past"  };
  if (days <= 1)  return { width: 100, cls: "bar-soon"  };
  if (days <= 7)  return { width: 75,  cls: "bar-soon"  };
  if (days <= 14) return { width: 45,  cls: "bar-next"  };
  if (days <= 30) return { width: 20,  cls: "bar-later" };
  return              { width: 8,   cls: "bar-later" };
};

export const getDaysLabel = (days) => {
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Demain";
  if (days < 0)  return `il y a ${Math.abs(days)}j`;
  return `dans ${days}j`;
};

export const resolveSuiviBadge = (statutPatient, dateEcart) => {
  const key   = (statutPatient || "en_attente").toLowerCase().trim();
  const badge = STATUT_PATIENT_BADGE_MAP[key] ?? STATUT_PATIENT_BADGE_MAP.en_attente;
  const showEcart = dateEcart > 0 && key === "en_retard";
  return { ...badge, showEcart };
};

export const resolvePrescriptionBadge = (statutPrescription) => {
  const key = (statutPrescription || "envoyee").toLowerCase();
  return PRESCRIPTION_BADGE_MAP[key] ?? PRESCRIPTION_BADGE_MAP.envoyee;
};

export const filterPrescriptions = (patients, search) => {
  if (!Array.isArray(patients)) return [];
  const q = (search || "").trim().toLowerCase();
  if (!q) return patients;
  return patients.filter((p) =>
    p.patientName?.toLowerCase().includes(q)    ||
    p.patientSurname?.toLowerCase().includes(q) ||
    p.numeroDossier?.toLowerCase().includes(q)  ||
    p.nomTraitement?.toLowerCase().includes(q)
  );
};

export const isValidateDisabled = (statutPrescription) => {
  const s = (statutPrescription || "").toLowerCase();
  return s === "delivree" || s === "modifie";
};

export const isModifyDisabled = (statutPrescription) => {
  const s = (statutPrescription || "").toLowerCase();
  return s === "delivree" || s === "modifie";
};