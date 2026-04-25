import API from "../../../../shared/utils/api";

const buildServiceError = (error, fallbackMessage) => {
  const payload = error?.response?.data;

  if (payload) {
    return {
      ...payload,
      message:
        payload.message ||
        payload.error ||
        error?.message ||
        fallbackMessage,
    };
  }

  return {
    message: error?.message || fallbackMessage,
  };
};

export const createSigneClinique = async (payload) => {
  try {
    const { data } = await API.post("/signesCliniques/add", payload);
    return data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors de l'enregistrement du signe clinique.");
  }
};

export const getSigneCliniqueByNumeroDossier = async (numeroDossier) => {
  try {
    const { data } = await API.get(`/signesCliniques/patient/${numeroDossier}`);
    return data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors du chargement des signes cliniques.");
  }
};

export const updateSigneClinique = async (id, payload) => {
  try {
    const { data } = await API.put(`/signesCliniques/update/${id}`, payload);
    return data;
  } catch (error) {
    throw buildServiceError(error, "Erreur lors de la mise a jour du signe clinique.");
  }
};
