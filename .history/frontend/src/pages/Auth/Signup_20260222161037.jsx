import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../../shared/hooks/useAuth.js';

function Signup() {
  const navigate = useNavigate();
  const { handleRegister, loading, error: authError, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    // Validation nom
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    }

    // Validation prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une majuscule";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une minuscule";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un chiffre";
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    // Validation CGU
    if (!agreeToTerms) {
      newErrors.terms = "Vous devez accepter les conditions d'utilisation";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation côté client
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Réinitialiser les erreurs
    setError(null);
    setSuccessMessage("");

    try {
      // Appel à l'API via AuthContext
      const response = await handleRegister(
        formData.nom.trim(),
        formData.prenom.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );
      
      console.log("Inscription réussie:", response);

      // Message de succès
      setSuccessMessage(
        "Votre compte a été créé avec succès ! Veuillez vérifier votre email pour l'activer."
      );

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setAgreeToTerms(false);

      // Rediriger vers login après 3 secondes
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: "Compte créé ! Connectez-vous après activation." 
          } 
        });
      }, 3000);
      
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      
      // Gérer les différents types d'erreurs
      if (err.response?.data?.errors) {
        // Erreurs de validation du backend
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.field] = error.message;
        });
        setErrors(backendErrors);
      } else if (err.response?.data?.message) {
        setErrors({ 
          submit: err.response.data.message 
        });
      } else if (err.message) {
        setErrors({ 
          submit: err.message 
        });
      } else {
        setErrors({ 
          submit: "Une erreur s'est produite lors de l'inscription" 
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Section gauche - Welcome */}
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-start relative">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4 leading-tight">Bienvenue</h1>
            <p className="text-base leading-relaxed opacity-90">
              Rejoignez<br />
              Notre Plateforme<br />
              Unique<br />
              Découvrez Une<br />
              Nouvelle Expérience
            </p>
          </div>
          
          <NavLink 
            to="/login" 
            className="mt-6 bg-white text-green-600 font-semibold py-3 px-10 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
          >
            SE CONNECTER
          </NavLink>
        </div>

        {/* Section droite - Register */}
        <div className="w-7/12 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Inscription</h2>
          
          {/* Message de succès */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Erreur globale */}
          {(authError || errors.submit) && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{authError || errors.submit}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row: Nom et Prénom */}
            <div className="grid grid-cols-2 gap-3">
              {/* Nom Input */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="nom">
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border ${
                    errors.nom ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                  }`}
                  placeholder="Votre nom"
                  disabled={loading}
                />
                {errors.nom && (
                  <p className="mt-1 text-xs text-red-600">{errors.nom}</p>
                )}
              </div>

              {/* Prenom Input */}
              <div>
                <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="prenom">
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border ${
                    errors.prenom ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                  }`}
                  placeholder="Votre prénom"
                  disabled={loading}
                />
                {errors.prenom && (
                  <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border ${
                  errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                }`}
                placeholder="Entrez votre email"
                disabled={loading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="password">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border ${
                  errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                }`}
                placeholder="Entrez votre mot de passe"
                disabled={loading}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="confirmPassword">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
                }`}
                placeholder="Confirmez votre mot de passe"
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  setErrors(prev => ({ ...prev, terms: "" }));
                }}
                className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400 mt-0.5"
                disabled={loading}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                J'accepte les conditions générales d'utilisation *
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-600 ml-6">{errors.terms}</p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inscription en cours...
                </>
              ) : (
                "S'INSCRIRE"
              )}
            </button>

            {/* Info */}
            <p className="text-xs text-gray-500 mt-2 text-center">
              * Champs obligatoires
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;