import { Alert } from "./alertService";

export const confirmAction = async (
  title = "Enregistrer les modifications ?",
  message = "Les changements seront appliqués.",
) => {
  const result = await Alert.fire({
    title,
    html: `<p>${message}</p>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Confirmer",
    cancelButtonText: "Annuler",
  });

  return result.isConfirmed;
};
