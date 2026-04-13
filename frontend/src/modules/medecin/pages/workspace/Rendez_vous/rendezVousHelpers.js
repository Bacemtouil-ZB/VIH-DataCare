import { STATUS_COLORS } from "./rendezVousConstants";

import { parseDateValue } from "../../../../../shared/utils/dateHelpers";

export const getStatusStyle = (status) =>
  STATUS_COLORS[status] || { bg: "#f1f5f9", color: "#334155" };

const toDateOnly = (value) => {
  const date = parseDateValue(value);
  if (!date) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

export const pickProchainePriseReference = (suivis = []) => {
  const rows = Array.isArray(suivis)
    ? suivis
        .filter((item) => item?.date_prochaine_prise)
        .map((item) => ({
          ...item,
          _parsedDate: toDateOnly(item.date_prochaine_prise),
        }))
        .filter((item) => item._parsedDate)
    : [];

  if (rows.length === 0) return null;

  rows.sort((a, b) => a._parsedDate - b._parsedDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = rows.find((item) => item._parsedDate >= today);
  const selected = upcoming || rows[rows.length - 1];

  return {
    date: selected.date_prochaine_prise,
    traitement: selected.nom_traitement || "Aucun",
    statutPatient: selected.statut_patient || "",
  };
};
