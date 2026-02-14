import API from "../../../shared/utils/api";

export const getPatientsWithOrdonnances = async () => {
  try {
    const response = await API.get("/patients/ordonnances");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  getPatientsWithOrdonnances,
};