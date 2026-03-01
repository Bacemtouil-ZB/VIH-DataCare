import React, { useState } from "react";
import { NavLink } from "react-router-dom";
<<<<<<< HEAD
=======
import { forgotPassword as requestPasswordReset } from "../../shared/services/authService.jsx";
>>>>>>> feature/resetPassword

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
<<<<<<< HEAD

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation email
=======
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

>>>>>>> feature/resetPassword
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("L'email est requis");
      return;
<<<<<<< HEAD
    } else if (!emailRegex.test(email)) {
=======
    }
    if (!emailRegex.test(email)) {
>>>>>>> feature/resetPassword
      setError("Format d'email invalide");
      return;
    }

<<<<<<< HEAD
    console.log("Email de récupération:", email);
    setError("");
    setIsSubmitted(true);
=======
    setError("");
    setIsLoading(true);

    try {
      await requestPasswordReset(email.trim());
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible d'envoyer le lien de reinitialisation.",
      );
    } finally {
      setIsLoading(false);
    }
>>>>>>> feature/resetPassword
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
<<<<<<< HEAD
        
        {/* Section gauche - Welcome */}
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-start relative">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4 leading-tight">Mot de passe oublié ?</h1>
            <p className="text-base leading-relaxed opacity-90">
              Pas de panique !<br />
              Nous allons vous aider<br />
              à récupérer votre<br />
              compte en quelques<br />
              étapes simples
            </p>
          </div>
          
          <NavLink 
            to="/login" 
=======
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-start relative">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Mot de passe oublie ?
            </h1>
            <p className="text-base leading-relaxed opacity-90">
              Entrez votre email pour recevoir un lien de reinitialisation.
            </p>
          </div>

          <NavLink
            to="/login"
>>>>>>> feature/resetPassword
            className="mt-6 bg-white text-green-600 font-semibold py-3 px-10 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
          >
            RETOUR
          </NavLink>
        </div>

<<<<<<< HEAD
        {/* Section droite - Forgot Password Form */}
        <div className="w-7/12 p-8 flex flex-col justify-center">
          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Récupération</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email Input */}
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">
=======
        <div className="w-7/12 p-8 flex flex-col justify-center">
          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Recuperation
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Entrez votre adresse email et nous enverrons un lien de
                reinitialisation.
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label
                    className="block text-gray-800 text-sm font-medium mb-1"
                    htmlFor="email"
                  >
>>>>>>> feature/resetPassword
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border ${
<<<<<<< HEAD
                      error ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
=======
                      error
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-200 focus:ring-green-400"
>>>>>>> feature/resetPassword
                    }`}
                    placeholder="exemple@email.com"
                    required
                  />
<<<<<<< HEAD
                  {error && (
                    <p className="mt-1 text-xs text-red-600">{error}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-3"
                >
                  ENVOYER LE LIEN
                </button>

                {/* Back to Login Link */}
                <div className="text-center pt-2">
                  <NavLink 
                    to="/login" 
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    ← Retour à la connexion
                  </NavLink>
                </div>

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
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Email envoyé !</h2>
                <p className="text-gray-600 mb-4 text-sm">
                  Nous avons envoyé un lien de réinitialisation à
                </p>
                <p className="font-semibold text-green-600 mb-6">{email}</p>
                
                <p className="text-xs text-gray-500 mb-6">
                  Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
                </p>

                <div className="space-y-3">
                  <NavLink 
                    to="/login"
                    className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    RETOUR À LA CONNEXION
                  </NavLink>
                  
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-200"
                  >
                    Renvoyer l'email
                  </button>
                </div>
              </div>
            </>
=======
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-3 disabled:opacity-60"
                >
                  {isLoading ? "ENVOI..." : "ENVOYER LE LIEN"}
                </button>

                <div className="text-center pt-2">
                  <NavLink
                    to="/login"
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Retour a la connexion
                  </NavLink>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Email envoye
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Si cet email existe, un lien de reinitialisation a ete envoye a:
              </p>
              <p className="font-semibold text-green-600 mb-6">{email}</p>

              <div className="space-y-3">
                <NavLink
                  to="/login"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  RETOUR A LA CONNEXION
                </NavLink>

                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                    setError("");
                  }}
                  className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-200"
                >
                  Renvoyer l'email
                </button>
              </div>
            </div>
>>>>>>> feature/resetPassword
          )}
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default ForgotPassword;
=======
export default ForgotPassword;
>>>>>>> feature/resetPassword
