import  { createContext, useState  } from "react";
import { login, register, logout } from "../shared/services/authService.jsx";
import { checkSession } from "../shared/services/authService.jsx";
import { useEffect } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true au démarrage
  const [error, setError] = useState(null);

  // Vérification de session au chargement de l'app (mais on peut aussi faire 
  //ça dans ProtectedRoute.jsx pour éviter de faire un appel au backend à chaque 
  //chargement de l'app)");

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
  const handleRegister = async (nom, prenom, email, password) => { // no role send from frontend
    setLoading(true);
    setError(null);
    try {
      const data = await register(nom, prenom, email, password);
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
    await logout();
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    setUser(null);
    setError(null);
  }
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