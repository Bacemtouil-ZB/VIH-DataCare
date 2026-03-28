import { SUIVI_BADGE_MAP, PRESCRIPTION_BADGE_MAP } from "./prescriptionsConstants";

// ── Calcul de date ────────────────────────────────────────────
export const calculatePreviewDate = (quantite) => {
  const months = Number.parseInt(quantite, 10);
  if (!months || months <= 0) return null;
  const next = new Date();
  next.setMonth(next.getMonth() + months);
  return next;
};


export const resolveSuiviBadge = (statutPatient, ecartJours) => {
  const key = (statutPatient || "").toLowerCase();
  const isPerdu   = key.includes("perdue") || key.includes("perdu");
  const isAttente = key.includes("attente");

  const entry = isPerdu
    ? SUIVI_BADGE_MAP.perdu
    : isAttente
      ? SUIVI_BADGE_MAP.attente
      : SUIVI_BADGE_MAP.actif;

  return {
    ...entry,
    showEcart: !isAttente && ecartJours > 0,
  };
};


export const resolvePrescriptionBadge = (statutPrescription) => {
  const key = (statutPrescription || "envoyee").toLowerCase();
  return key === "delivree"
    ? PRESCRIPTION_BADGE_MAP.delivree
    : PRESCRIPTION_BADGE_MAP.envoyee;
};

export const filterPrescriptions = (patients, search) => {
  if (!Array.isArray(patients)) return [];
  const q = (search || "").trim().toLowerCase();
  if (!q) return patients;
  return patients.filter(
    (p) =>
      p.patientName?.toLowerCase().includes(q)    ||
      p.patientSurname?.toLowerCase().includes(q) ||
      p.numeroDossier?.toLowerCase().includes(q)  ||
      p.nomTraitement?.toLowerCase().includes(q),
  );
};

export const isValidateDisabled = (statutPrescription) =>
  (statutPrescription || "").toLowerCase() === "delivree";