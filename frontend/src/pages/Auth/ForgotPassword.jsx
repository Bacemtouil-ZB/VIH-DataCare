import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email de récupération:", email);
    // Simuler l'envoi de l'email
    setIsSubmitted(true);
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center p-6 overflow-hidden">
      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Section gauche - Welcome */}
        <div className="w-5/12 bg-[#1B5E20] text-white p-12 flex flex-col justify-center items-start relative">
          <div className="mb-8">
            <div className="mb-6">
                <i className="bi bi-heart-pulse-fill text-5xl text-white"></i>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Mot de passe<br />oublié ?
            </h1>
            <p className="text-lg leading-relaxed opacity-95">
              Pas de panique !<br />
              Nous allons vous aider à<br />
              récupérer votre compte<br />
              en quelques étapes simples.<br />
              <span className="block mt-4 text-base opacity-80">
                Entrez votre email pour<br />
                recevoir un lien de<br />
                réinitialisation.
              </span>
            </p>
          </div>
        </div>

        {/* Section droite - Forgot Password Form */}
        <div className="w-7/12 bg-gray-100 p-12 flex flex-col justify-center">
          {!isSubmitted ? (
            <>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Récupération</h2>
              <p className="text-gray-600 mb-8">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="email">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E20] placeholder-gray-400 border border-gray-300"
                    placeholder="exemple@email.com"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  ENVOYER LE LIEN
                </button>

                {/* Back to Login Link */}
                <div className="text-center">
                  <NavLink 
                    to="/login" 
                    className="text-sm text-[#1B5E20] hover:text-[#2E7D32] hover:underline"
                  >
                    ← Retour à la connexion
                  </NavLink>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-[#1B5E20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Email envoyé !</h2>
                <p className="text-gray-600 mb-8">
                  Nous avons envoyé un lien de réinitialisation à<br />
                  <span className="font-semibold text-[#1B5E20]">{email}</span>
                </p>
                
                <p className="text-sm text-gray-500 mb-6">
                  Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
                </p>

                <div className="space-y-3">
                  <NavLink 
                    to="/login"
                    className="block w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    RETOUR À LA CONNEXION
                  </NavLink>
                  
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-200"
                  >
                    Renvoyer l'email
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;