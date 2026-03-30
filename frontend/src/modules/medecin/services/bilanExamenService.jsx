import API from "../../../shared/utils/api";


export const getBilansByNumeroDossier = async (numeroDossier) => {
  const res = await API.get(`bilan-examens/patient/${numeroDossier}`);
  return res.data; 
};

export const createBilan = async (data) => {
  const res = await API.post(`bilan-examens/add`, data);
  return res.data; 
};

export const updateBilan = async (id, data) => {
  const res = await API.put(`bilan-examens/update/${id}`, data);
  return res.data; 
};