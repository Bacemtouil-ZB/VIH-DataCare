import API from "../../../shared/utils/api"; // adjust to your API helper

export const listPatientConclusions = async (numero, { limit = 10, offset = 0 } = {}) => {
  const res = await API.get(`/medecin/patients/${encodeURIComponent(numero)}/conclusions`, {
    params: { limit, offset },
  });
  return res.data;
};

export const createPatientConclusion = async (numero, { content }) => {
  const res = await API.post(`/medecin/patients/${encodeURIComponent(numero)}/conclusions`, { content });
  return res.data;
};

export const updateConclusion = async (id, { content }) => {
  const res = await API.put(`/medecin/conclusions/${id}`, { content });
  return res.data;
};

export const getConclusionDetails = async (id) => {
  const res = await API.get(`/medecin/conclusions/${id}`);
  return res.data;
};