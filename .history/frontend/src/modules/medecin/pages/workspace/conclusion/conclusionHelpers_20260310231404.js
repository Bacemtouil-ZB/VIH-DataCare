export function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("fr-FR");
}

export function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function validateConclusion(html) {
  const text = stripHtml(html);

  if (text.length < 5) {
    return "Veuillez saisir une conclusion (min 5 caractères)";
  }

  return null;
}

export function canEditConclusion(conclusion, currentDoctorId) {
  return String(conclusion.doctor_id) === String(currentDoctorId);
}
