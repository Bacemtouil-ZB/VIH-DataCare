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

// Override pour les actions dont le module ne peut pas être déduit automatiquement ( not obvious)
const ACTION_MODULE_OVERRIDE = {
  LOGIN_SUCCESS: "AUTH",
  LOGIN_FAILED: "AUTH",
  PRESCRIPTION_VALIDER: "PRESCRIPTION",
  PRESCRIPTION_VALIDER_MODIFIEE: "PRESCRIPTION",
  PERMISSION_SET: "PERMISSION",
  PATIENT_PRESCRIPTION_LIST_VIEW: "PATIENT_PRESCRIPTION",
  SUIVI_BIOLOGIQUE_KPIS_VIEW: "SUIVI_BIOLOGIQUE",
  SUIVI_BIOLOGIQUE_CD4_VIEW: "SUIVI_BIOLOGIQUE",
  SUIVI_BIOLOGIQUE_CV_VIEW: "SUIVI_BIOLOGIQUE",
  SUIVI_BIOLOGIQUE_PERIODES_ARV_VIEW: "SUIVI_BIOLOGIQUE",
  SUIVI_BIOLOGIQUE_TABLEAU_VIEW: "SUIVI_BIOLOGIQUE",
  DOCTOR_CONCLUSION_LIST_VIEW: "DOCTOR_CONCLUSION",
  DOCTOR_CONCLUSION_VIEW: "DOCTOR_CONCLUSION",
};

export const getActionModule = (action) => {
  if (ACTION_MODULE_OVERRIDE[action]) return ACTION_MODULE_OVERRIDE[action];
  // Par défaut, on considère que le module est la partie de l'action avant le dernier "_"
  const parts = String(action).split("_");
  if (parts.length >= 2) parts.pop();
  return parts.join("_");
};

export const buildDiffRows = (oldData, newData) => {
  //vérifier si une valeur est un objet simple
  const oldObj = isPlainObject(oldData) ? oldData : {};
  const newObj = isPlainObject(newData) ? newData : {};

  const excludedKeys = new Set([
    // IDs techniques
    "id",
    "patient_id",
    "medecin_id",
    "doctor_id",
    "user_id",
    "entity_id",
    "examen_id",
    "appareil_id",

    // Audit trail
    "created_by",
    "updated_by",
    "createdBy",
    "updatedBy",

    // Timestamps
    "created_at",
    "updated_at",
    "createdAt",
    "updatedAt",
    "granted_at",
    "expires_at",

    // Noms dénormalisés
    "updated_by_nom",
    "updated_by_prenom",
    "created_by_nom",
    "created_by_prenom",
    "patient_name",
    "patient_numero",
    "patient_surname",
  ]);

  const keys = Array.from(
    new Set([...Object.keys(oldObj), ...Object.keys(newObj)]),
  )
    .filter((k) => !excludedKeys.has(k))
    // Exclure automatiquement tous les champs qui finissent par _id
    .filter((k) => !k.endsWith("_id"))
    .filter((k) => !k.endsWith("_at"))
    .filter((k) => !k.endsWith("_by"))
    .sort();

  return keys.map((k) => ({
    key: k,
    oldValue: oldObj[k],
    newValue: newObj[k],
    changed:
      JSON.stringify(oldObj[k] ?? null) !== JSON.stringify(newObj[k] ?? null),
  }));
};