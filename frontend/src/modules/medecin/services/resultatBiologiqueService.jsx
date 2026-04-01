import API from "../../../shared/utils/api";

export const getResultatsByNumeroDossier = async (numeroDossier) => {
  const res = await API.get(`resultats-biologiques/patient/${numeroDossier}`);
  return res.data; // { success, resultats }
};

export const getDernierBilanPrescrit = async (numeroDossier) => {
  const res = await API.get(`resultats-biologiques/dernier-bilan/${numeroDossier}`);
  return res.data; // { success, bilan }
};

export const createResultat = async (data) => {
  const res = await API.post(`resultats-biologiques/add`, data);
  return res.data; // { success, resultat }
};

export const updateResultat = async (id, data) => {
  const res = await API.put(`resultats-biologiques/update/${id}`, data);
  return res.data; // { success, resultat }
};
