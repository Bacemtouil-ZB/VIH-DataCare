import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth.js';

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, user, error, setError, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      // Rediriger selon le rôle
      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'medecin':
          navigate('/medecin');
          break;
        case 'pharmacien':
          navigate('/pharmacien');
          break;
        case 'analyste':
          navigate('/analyste');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, navigate]);

  // Nettoyer les erreurs quand on modifie le formulaire
  useEffect(() => {
    if (error) setError(null);
    if (localError) setLocalError('');
  }, [formData.email, formData.password, formData.rememberMe, error, setError, localError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLocalError('');
  setIsSubmitting(true);

  if (!formData.email.trim() || !formData.password.trim()) {
    setLocalError('Tous les champs sont requis');
    setIsSubmitting(false);
    return;
  }

  try {
    // ✅ Passer les deux arguments séparément
    await handleLogin(formData.email.trim(), formData.password.trim());
  } catch (err) {
    console.error('Erreur de connexion:', err);
    setLocalError(
      err.response?.data?.message || 'Erreur de connexion, vérifiez vos identifiants'
    );
  } finally {
    setIsSubmitting(false);
  }
};


// 🔹 Pour l'affichage
const displayError = localError || error;


  return (
    <div className="min-h-screen flex">
      {/* Partie gauche - Bienvenue */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 to-green-700 text-white p-12 flex-col justify-center">
        <h1 className="text-5xl font-bold mb-6">Bienvenue</h1>
        <p className="text-xl mb-4">Rejoignez</p>
        <p className="text-xl mb-4">Notre Plateforme</p>
        <p className="text-xl mb-4">Unique</p>
        <p className="text-xl mb-8">Découvrez Une</p>
        <p className="text-xl">Nouvelle Expérience</p>
        
        <Link 
          to="/signup" 
          className="mt-12 inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center max-w-xs"
        >
          S'INSCRIRE
        </Link>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Connexion</h2>

          {/* Message d'erreur */}
          {displayError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Se souvenir / Mot de passe oublié */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link 
                to="/forgotPassword" 
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting || loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : (
                'SE CONNECTER'
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              * Champs obligatoires
            </p>
          </form>

          {/* Lien d'inscription pour mobile */}
          <div className="mt-6 text-center lg:hidden">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;