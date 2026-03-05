import { SECTIONS, initialState } from "./antecedentsConfig.jsx";
import { normalizeFromApi } from "./helpers.js";

export const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const buildFormFromSnapshot = (snapshot) => {
  const next = { ...initialState };
  for (const { id } of SECTIONS) {
    const normalized = normalizeFromApi(id, snapshot?.[id]);
    next[id] =
      normalized ??
      (Array.isArray(initialState[id]) ? [] : { ...initialState[id] });
  }
  return next;
};
