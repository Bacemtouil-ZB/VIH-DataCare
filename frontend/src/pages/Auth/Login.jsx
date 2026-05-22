import  { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth.js';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  //const location = useLocation();
  const { handleLogin, user, error, setError, loading } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect si connecté
  useEffect(() => {
    if (!user) return;
    const routes = { admin: '/admin', medecin: '/medecin', pharmacien: '/pharmacien', analyste: '/analyste' };
    navigate(routes[user.role] || '/');
  }, [user, navigate]); // when user get from context, it will trigger this effect and navigate to the appropriate route based on the user's role

  //show backend errors
  useEffect(() => {
    if (!error) return;
    toast.error(error);
    setError(null);
  }, [error, setError]);


  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value })); // spread operator . copy the previous state and update only the changed field

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      return toast.warn('Veuillez remplir tous les champs.');
    }
    setIsSubmitting(true);
    try {
      await handleLogin(formData.email.trim(), formData.password.trim());
      toast.success('Connexion réussie !');
    } catch (err) {
      console.error(err.response?.data?.message || 'Identifiants incorrects.');//authcontexte handle login error already
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <Link
        to="/"
        aria-label="Retour a l'accueil"
        className="absolute left-8 top-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 no-underline shadow-md transition-all hover:-translate-y-0.5 hover:text-gray-800 hover:no-underline hover:shadow-lg"
      >
        <span aria-hidden="true" className="text-xl leading-none">&larr;</span>
      </Link>

      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Gauche */}
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Bienvenue</h1>
          <p className="text-base opacity-90 leading-relaxed mb-8">
            Rejoignez notre plateforme et découvrez une nouvelle expérience.
          </p>
          <Link to="/signup" className="bg-white text-green-600 font-semibold py-3 px-10 rounded-lg text-center no-underline hover:bg-gray-50 hover:no-underline transition-all">
            S'INSCRIRE
          </Link>
        </div>

        {/* Droite */}
        <div className="w-7/12 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Entrez votre email" autoComplete="email" disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Entrez votre mot de passe" autoComplete="current-password" disabled={isSubmitting}
                  className="w-full px-3 py-2 pr-10 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" disabled={isSubmitting || loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {(isSubmitting || loading) ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion en cours...
                </>
              ) : 'SE CONNECTER'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
