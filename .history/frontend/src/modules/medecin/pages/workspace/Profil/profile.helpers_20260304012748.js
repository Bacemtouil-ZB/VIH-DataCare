import { toast } from "react-toastify";

export const sanitizeText = (value) =>
  typeof value === "string" ? value.replace(/[<>]/g, "") : value;

export const normalizeNumero = (raw) => {
  let value = sanitizeText(raw);

  // user shouldn't type F- manually (controlled by hospitalisation)
  value = value.replace(/^F-/, "");

  // keep only digits + dash
  value = value.replace(/[^0-9-]/g, "");

  return value;
};

export const isNumeroValid = (numero) => {
  if (!numero) return true;
  const cleaned = String(numero).replace(/^F-/, "");
  return /^\d{3}-\d{4}$/.test(cleaned);
};

export const validateNumeroYear = (numero) => {
  const cleaned = String(numero || "").replace(/^F-/, "");
  const match = cleaned.match(/^(\d{3})-(\d{4})$/);
  if (!match) return;

  const year = parseInt(match[2], 10);
  const currentYear = new Date().getFullYear();

  if (year > currentYear) {
    toast.error(`L'année doit être ≤ ${currentYear}`);
  }
};

export const filterPostalCodesByGovernorate = (postalCodes, governorate) =>
  (postalCodes || []).filter((pc) => pc.governorate === governorate);
