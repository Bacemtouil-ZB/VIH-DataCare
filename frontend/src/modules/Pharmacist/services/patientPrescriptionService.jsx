import API from "../../../shared/utils/api";

export const getPatientsWithPrescriptions = async () => {
  try {
    const response = await API.get("/patients/prescriptions-medicales");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};



export default {
  getPatientsWithPrescriptions,
  
};
