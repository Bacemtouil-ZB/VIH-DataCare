import  { createContext, useState , useEffect } from "react";
import { login, register, logout , checkSession} from "../shared/services/authService.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // true au démarrage
  const [error, setError] = useState(null);

  useEffect(() => {
  const verifyUser = async () => {
    try {
      const data = await checkSession();

      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.log("Pas connecté", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  verifyUser();
}, []);

  // ── CONNEXION ──
 const handleLogin = async (email, password) => {
  setLoading(true);
  setError(null);

  try {
    const data = await login(email, password); // envoie email et password séparés
    setUser(data.user); // stocker utilisateur
    return data;
  } catch (err) {
    const msg = err.response?.data?.message || "Erreur de connexion";
    setError(msg);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // ── INSCRIPTION ──
  const handleRegister = async (nom, prenom, email, password, role = 'medecin') => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(nom, prenom, email, password, role);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur d'inscription";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── DÉCONNEXION ──
  const handleLogout = async () => {
    try {
      await logout(); // backend supprime le cookie
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user, 
      loading, 
      error, 
      setError,
      handleLogin,
      handleRegister,
      handleLogout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };