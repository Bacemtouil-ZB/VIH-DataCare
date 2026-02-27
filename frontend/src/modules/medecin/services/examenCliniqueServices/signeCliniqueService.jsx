import API from "../../../../shared/utils/api";

export const createSigneClinique = async (payload) => {
  const { data } = await API.post("/signesCliniques/add", payload);
  return data;
};

export const getSigneCliniqueByNumeroDossier = async (numeroDossier) => {
  const { data } = await API.get(`/signesCliniques/patient/${numeroDossier}`);
  return data;
};

export const updateSigneClinique = async (id, payload) => {
  const { data } = await API.put(`/signesCliniques/update/${id}`, payload);
  return data;
};