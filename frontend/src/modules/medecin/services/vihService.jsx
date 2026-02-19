import API from "../../../shared/utils/api";

export const getVihById = async (vihId) => {
  const response = await API.get(`/vih/${vihId}`);
  return response.data?.vih;
};

export const getVihByPatient = async (patientId) => {
  const response = await API.get(`/vih/patient/${patientId}`);
  return response.data?.vih;
};
export const createVih = async (vihData) => {
  const response = await API.post("/vih/add", vihData);
  return response.data?.vih;
};

export const updateVih = async (vihId, vihData) => {
  const response = await API.put(`/vih/update/${vihId}`, vihData);
  return response.data?.vih;
};