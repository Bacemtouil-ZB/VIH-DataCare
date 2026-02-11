import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isReset, setIsReset] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // Fonction de validation pour le mot de passe
  const validatePassword = (password) => {
    if (!password) {
      return "Le mot de passe est requis";
    }
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }
    if (!/[a-z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une minuscule";
    }
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    return "";
  };

  // Fonction de validation pour la confirmation du mot de passe
  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
      return "La confirmation du mot de passe est requise";
    }
    if (confirmPassword !== password) {
      return "Les mots de passe ne correspondent pas";
    }
    return "";
  };

  // Gérer les changements de champs
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

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
    
    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (!passwordError && !confirmPasswordError) {
      console.log("Mot de passe réinitialisé:", formData.password);
      setIsReset(true);

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Section gauche - Welcome */}
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-start relative">
          <div className="mb-6">
            <div className="mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔑</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Nouveau<br />mot de passe
            </h1>
            <p className="text-base leading-relaxed opacity-90">
              Créez un nouveau<br />
              mot de passe<br />
              sécurisé pour<br />
              votre compte
            </p>
          </div>
          
          <NavLink 
            to="/login" 
            className="mt-6 bg-white text-green-600 font-semibold py-3 px-10 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
          >
            RETOUR
          </NavLink>
        </div>

        {/* Section droite - Reset Password Form */}
        <div className="w-7/12 p-8 flex flex-col justify-center">
          {!isReset ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Réinitialisation</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Entrez votre nouveau mot de passe. Assurez-vous qu'il soit fort et sécurisé.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Password Input */}
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="password">
                    Nouveau mot de passe *
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
                    placeholder="Entrez votre nouveau mot de passe"
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
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-3"
                >
                  RÉINITIALISER LE MOT DE PASSE
                </button>

                {/* Info */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  * Champs obligatoires
                </p>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Mot de passe réinitialisé !
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Votre mot de passe a été modifié avec succès.
                </p>
                
                <p className="text-xs text-gray-500 mb-6">
                  Vous allez être redirigé vers la page de connexion...
                </p>

                <NavLink 
                  to="/login"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  SE CONNECTER MAINTENANT
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;