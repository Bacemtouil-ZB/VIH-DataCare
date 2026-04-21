import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { forgotPassword as requestPasswordReset } from "../../shared/services/authService.jsx";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("L'email est requis");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Format d'email invalide");
      return;
    }

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
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-start relative">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Mot de passe oublie ?
            </h1>
            <p className="text-base leading-relaxed opacity-90">
              Entrez votre email pour recevoir un lien de reinitialisation.
            </p>
          </div>
        </div>

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
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border ${
                      error
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-200 focus:ring-green-400"
                    }`}
                    placeholder="exemple@email.com"
                    required
                  />
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
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
