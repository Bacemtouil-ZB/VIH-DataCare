import API from "../../../shared/utils/api";

export const getResultatsByNumeroDossier = async (numeroDossier) => {
  try {
    const res = await API.get(`resultats-biologiques/patient/${numeroDossier}`);
    return res.data; // { success, resultats }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// export const getDernierBilanPrescrit = async (numeroDossier) => {
//   try {
//     const res = await API.get(`resultats-biologiques/dernier-bilan/${numeroDossier}`);
//     return res.data; // { success, bilan }
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

export const createResultat = async (data) => {
  try {
    const res = await API.post(`resultats-biologiques/add`, data);
    return res.data; // { success, resultat }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateResultat = async (id, data) => {
  try {
    const res = await API.put(`resultats-biologiques/update/${id}`, data);
    return res.data; // { success, resultat }
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
