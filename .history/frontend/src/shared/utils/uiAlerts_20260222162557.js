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

export const confirmEdit = async (
  title = "Modifier la fiche ?",
  message = "Les champs vont être activés pour modification.",
) => {
  const result = await Alert.fire({
    title,
    html: `<p>${message}</p>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Modifier",
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

export const alertLoading = (message = "Traitement en cours...") =>
  Alert.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Alert.showLoading();
    },
  });

export const alertInfo = (message = "Information", title = "Information") =>
  Alert.fire({
    icon: "info",
    title: title,
    text: message,
    confirmButtonText: "OK",
    confirmButtonColor: "#3085d6",
  });
