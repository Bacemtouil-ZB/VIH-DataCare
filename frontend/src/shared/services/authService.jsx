import API from "../utils/api.js";

// ── LOGIN ──
// Backend : POST /api/auth/login
// Envoie  : { email, password }
// Reçoit  : { success, message, user: { id, nom, prenom, email, role, isActivated } }
export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

// ── REGISTER ──
// Backend : POST /api/auth/register
// Envoie  : { nom, prenom, email, password, role }
// Reçoit  : { success, message, user }
export const register = async (nom, prenom, email, password, role = 'medecin') => {
  const res = await API.post("/auth/register", { 
    nom, 
    prenom, 
    email, 
    password,
    role 
  });
  return res.data;
};

// ── LOGOUT ──
// Backend : POST /api/auth/logout  (besoin du cookie token)
// Reçoit  : { success, message }
export const logout = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

// ── VÉRIFIER LA SESSION ──
// Backend : GET /api/auth/me  (besoin du cookie token)
// Reçoit  : { success, user: { ... } }
export const checkSession = async () => {
 try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Erreur /auth/me:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

