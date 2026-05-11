import API from "../utils/api.js";


// ── REGISTER ──
export const register = async (nom, prenom, email, password) => { // no role send from frontend 
  const res = await API.post("/auth/register", { 
    nom, 
    prenom, 
    email, 
    password,
  });
  return res.data;
};


// ── LOGIN ──
export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};



// ── LOGOUT ──
export const logout = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

// ── VÉRIFIER LA SESSION ──
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

// —— FORGOT PASSWORD ——
export const forgotPassword = async (email) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

// —— RESET PASSWORD ——
export const resetPassword = async (token, password, confirmPassword) => {
  const res = await API.post("/auth/reset-password", {
    token,
    password,
    confirmPassword,
  });
  return res.data;
};
