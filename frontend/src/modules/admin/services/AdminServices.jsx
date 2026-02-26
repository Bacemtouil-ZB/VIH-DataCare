import API from "../../../shared/utils/api";
// ── LISTE DES UTILISATEURS (admin) ──
// Backend : GET /api/admin/users?role=medecin  (role optionnel)
// Reçoit  : { success, count, users: [...] }
export const getUsers = async (role) => {
  const res = await API.get("/admin/users", {
    params: { role },
  });
  return res.data;
};


export const activateUser = async (userId, isactivated) => {
  try {
    const res = await API.post("/admin/activation", { 
      userId, 
      isactivated 
    });
    console.log("Réponse succès:", res.data);
    return res.data;
  } catch (error) {
    console.error("Erreur", error.response ? error.response.data : error.message);
    throw error;
  }
};

// ── Changer rôle
export const changeUserRole = async (userId, role) => {
  const res = await API.post("/admin/change-role", { userId, role });
  return res.data;
};