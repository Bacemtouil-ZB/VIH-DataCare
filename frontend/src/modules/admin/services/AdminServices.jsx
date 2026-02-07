import API from "../utils/api.js";
// ── LISTE DES UTILISATEURS (admin) ──
// Backend : GET /api/auth/admin/users?role=medecin  (role optionnel)
// Reçoit  : { success, count, users: [...] }
export const getUsers = async (role) => {
  const res = await API.get("/auth/admin/users", {
    params: { role },
  });
  return res.data;
};

// ── ACTIVER / DÉSACTIVER UN UTILISATEUR (admin) ──
// Backend : POST /api/auth/admin/activation
// Envoie  : { userId, isActivated }
// Reçoit  : { success, message, user }
export const activateUser = async (userId, isActivated) => {
  const res = await API.post("/auth/admin/activation", { userId, isActivated });
  return res.data;
};
