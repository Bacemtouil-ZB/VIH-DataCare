export function formatDateFr(dateValue, fallback = "N/A") {
  if (!dateValue) return fallback;
  return new Date(dateValue).toLocaleDateString("fr-FR");
}

export function formatDateTimeFr(dateValue, fallback = "-") {
  if (!dateValue) return fallback;
  return new Date(dateValue).toLocaleString("fr-FR");
}

export function handleCancelForm(setShowForm, resetForm, ) {
  setShowForm(false);
  resetForm();
}

export function openFormForCreate(setDetailItem, resetForm, setShowForm) {
  setDetailItem(null);
  resetForm();
  setShowForm(true);
}

export function showDetailMode(setShowForm, setDetailItem, item) {
  setShowForm(false);
  setDetailItem(item);
}

export function mapAutresSignesFromApi(list) {
  return (list || []).map(({ id, appareil_id, appareil, description }) => ({
    id,
    appareil_id,
    appareil,
    description,
  }));
}

export function buildAutreSigneItem(appareils, appareilSel, description, parseAppareilId = false) {
  if (!appareilSel) return { error: "Veuillez selectionner un appareil", item: null };
  if (!description?.trim()) return { error: "Veuillez saisir une description", item: null };

  const selectedId = parseInt(appareilSel, 10);
  const app = appareils.find((a) => parseInt(a.id, 10) === selectedId);
  if (!app) return { error: "Appareil non trouve", item: null };

  return {
    error: null,
    item: {
      id: Date.now(),
      appareil_id: parseAppareilId ? selectedId : app.id,
      appareil: app.libelle,
      description: description.trim(),
    },
  };
}

export function removeAutreSigneById(list, id) {
  return list.filter((s) => s.id !== id);
}

export function updateAutreSigneDescription(list, id, nouvelleDesc) {
  return list.map((s) => (s.id === id ? { ...s, description: nouvelleDesc } : s));
}
