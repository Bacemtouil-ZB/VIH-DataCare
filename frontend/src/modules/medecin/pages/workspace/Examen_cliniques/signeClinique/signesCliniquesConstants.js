export const PAGE_CONTAINER_CLASS = "ec-page-bg";
export const HISTORY_HEADERS = ["Date", "Taille (cm)", "Poids (kg)", "IMC", "Action"];
export const calcIMC = (t, p) => {
  const v = p / Math.pow(t / 100, 2);
  if (v < 18.5) return { val: v.toFixed(1), label: "Insuffisance pondérale", color: "#0891b2" };
  if (v < 25)   return { val: v.toFixed(1), label: "Poids normal",           color: "#16a34a" };
  if (v < 30)   return { val: v.toFixed(1), label: "Surpoids",               color: "#d97706" };
  return           { val: v.toFixed(1), label: "Obésité",                    color: "#dc2626" };
};
export const FORM_SC_INIT = {
  signeId: null, isModifying: false,
  taille: "", poids: "", autresSignes: [], appareilSel: "", description: "",
};
