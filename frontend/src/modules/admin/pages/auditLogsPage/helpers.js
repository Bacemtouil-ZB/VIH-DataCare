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
  if (typeof v === "string") return isIsoDateString(v) ? toFrDateTime(v, "—") : v;
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

export const buildDiffRows = (oldData, newData) => {
  const oldObj = isPlainObject(oldData) ? oldData : {};
  const newObj = isPlainObject(newData) ? newData : {};

  const excludedKeys = new Set([
    "id",
    "created_by",
    "updated_by",
    "createdBy",
    "updatedBy",
  ]);

  const keys = Array.from(
    new Set([...Object.keys(oldObj), ...Object.keys(newObj)]),
  )
    .filter((k) => !excludedKeys.has(k))
    .sort();

  return keys.map((k) => ({
    key: k,
    oldValue: oldObj[k],
    newValue: newObj[k],
    changed:
      JSON.stringify(oldObj[k] ?? null) !== JSON.stringify(newObj[k] ?? null),
  }));
};
