import { toFrDateTime } from "../../../../shared/utils/dateHelpers";

const isIsoDateString = (v) =>
  typeof v === "string" &&
  /\d{4}-\d{2}-\d{2}T/.test(v) &&
  !isNaN(new Date(v).getTime());

export const fmt = (v) => {
  try {
    return toFrDateTime(v, "—");
  } catch {
    return v || "—";
  }
};

export const txt = (v) => (v === null || v === undefined || v === "" ? "—" : v);

export const isPlainObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

export const prettyValue = (v) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Oui" : "Non";
  if (typeof v === "number") return String(v);
  if (typeof v === "string")
    return isIsoDateString(v) ? toFrDateTime(v, "—") : v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

export const getActionModule = (action) => {
  const parts = String(action).split("_");
  if (parts.length >= 2) parts.pop();
  return parts.join("_");
};

// export const buildDiffRows = (oldData, newData) => {
//   const oldObj = isPlainObject(oldData) ? oldData : {};
//   const newObj = isPlainObject(newData) ? newData : {};

//   const excludedKeys = new Set([
//     "created_by",
//     "updated_by",
//     "createdBy",
//     "updatedBy",
//     "patient_name",
//     "patient_numero",
//     "patient_surname",
//   ]);

//   const keys = Array.from(
//     new Set([...Object.keys(oldObj), ...Object.keys(newObj)]),
//   )
//     .filter((k) => !excludedKeys.has(k))
//     .sort();

//   return keys.map((k) => ({
//     key: k,
//     oldValue: oldObj[k],
//     newValue: newObj[k],
//     changed:
//       JSON.stringify(oldObj[k] ?? null) !== JSON.stringify(newObj[k] ?? null),
//   }));
// };

export const buildDiffRows = (oldData, newData) => {
  const oldObj = isPlainObject(oldData) ? oldData : {};
  const newObj = isPlainObject(newData) ? newData : {};

  const excludedKeys = new Set([
    "created_by",
    "updated_by",
    "createdBy",
    "updatedBy",
    "patient_name",
    "patient_numero",
    "patient_surname",
  ]);

  // Définis l'ordre souhaité ici
  const keyOrder = [
    "nom",
    "prenom",
    "date_naissance",
    "telephone",
    "adresse",
    // ... les autres clés que tu veux en premier
  ];

  const keys = Array.from(
    new Set([...Object.keys(oldObj), ...Object.keys(newObj)]),
  )
    .filter((k) => !excludedKeys.has(k))
    .sort((a, b) => {
      const indexA = keyOrder.indexOf(a);
      const indexB = keyOrder.indexOf(b);

      // Si les deux sont dans keyOrder → ordre défini
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;

      // Si seulement A est dans keyOrder → A passe en premier
      if (indexA !== -1) return -1;

      // Si seulement B est dans keyOrder → B passe en premier
      if (indexB !== -1) return 1;

      // Si aucun n'est dans keyOrder → ordre alphabétique
      return a.localeCompare(b);
    });

  return keys.map((k) => ({
    key: k,
    oldValue: oldObj[k],
    newValue: newObj[k],
    changed:
      JSON.stringify(oldObj[k] ?? null) !== JSON.stringify(newObj[k] ?? null),
  }));
};
