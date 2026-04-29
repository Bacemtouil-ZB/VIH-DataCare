import API from "../../../shared/utils/api";

export const createRendezvous = async (data) => {
  try {
    const response = await API.post("/rendezvous/add", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRendezvousByNumeroDossier = async (numeroDossier) => {
  try {
    const response = await API.get(`/rendezvous/patient/${numeroDossier}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getRendezvousById = async (id) => {
  try {
    const response = await API.get(`/rendezvous/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateRendezvous = async (id, data) => {
  try {
    const response = await API.put(`/rendezvous/update/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ── GET prochain rendez-vous par patient ──────────────────────
// Retourne { [patient_id]: { date, heure, type, statut } }
export const getNextRendezVousPerPatient = async () => {
  try {
    // ✅ minuscule — cohérent avec app.use("/api/rendezvous", ...) dans server.js
    const response = await API.get("/rendezvous/next-all");
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.reduce((map, rdv) => {
      map[rdv.patient_id] = {
        date:   rdv.date,
        heure:  rdv.heure,
        type:   rdv.type,
        statut: rdv.statut,
      };
      return map;
    }, {});
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  createRendezvous,
  getRendezvousByNumeroDossier,
  getNextRendezVousPerPatient,
  getRendezvousById,
  updateRendezvous,
};