// Helpers pour resultats biologiques / genotypage

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Lecture fichier échouée"));
    reader.readAsDataURL(file);
  });

export const normalizeGenotypageUrls = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return [value];
    }
  }
  return [];
};

export const deduplicateGenotypageUrls = (urls = []) => {
  const seen = new Set();

  return normalizeGenotypageUrls(urls).filter((url) => {
    const normalized = typeof url === "string" ? url.trim() : "";

    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
};

export const collectGenotypageUrls = (resultats = [], extraUrls = []) => {
  const resultatsUrls = Array.isArray(resultats)
    ? resultats.flatMap((item) => normalizeGenotypageUrls(item?.genotypage_file_url))
    : [];

  return deduplicateGenotypageUrls([...resultatsUrls, ...normalizeGenotypageUrls(extraUrls)]);
};

export const formatGenotypageValue = (files) => {
  if (!Array.isArray(files) || files.length === 0) return "";
  return files.length === 1 ? files[0] : JSON.stringify(files);
};

export const isPdf = (url) =>
  typeof url === "string" &&
  (url.startsWith("data:application/pdf") || url.toLowerCase().endsWith(".pdf"));

// ── Formattage lisible d'une date ISO → fr-FR ────────────────────────────────
// Déplacé depuis ResultatsBiologiquesUI : c'est une fonction pure, pas du rendu.
export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR");
};
