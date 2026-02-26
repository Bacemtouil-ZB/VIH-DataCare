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

export const confirmDelete = async () =>
  confirmAction({
    title: "Supprimer cet élément ?",
    message: "Cette action est irréversible.",
    confirmText: "Supprimer",
    icon: "warning",
  });

export const alertSuccess = (message = "Opération réussie") =>
  Alert.fire({
    icon: "success",
    title: "Succès",
    text: message,
    timer: 1800,
    showConfirmButton: false,
  });

export const alertError = (message = "Une erreur est survenue") =>
  Alert.fire({
    icon: "error",
    title: "Erreur",
    text: message,
  });
