import React, { useMemo, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { resetPassword as resetPasswordRequest } from "../../shared/services/authService.jsx";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    global: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [searchParams] = useSearchParams(); //lire  les paramètres de l’URL
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const validatePassword = (password) => {
    if (!password) return "Le mot de passe est requis";
    if (password.length < 8)
      return "Le mot de passe doit contenir au moins 8 caracteres";
    if (!/[A-Z]/.test(password))
      return "Le mot de passe doit contenir au moins une majuscule";
    if (!/[a-z]/.test(password))
      return "Le mot de passe doit contenir au moins une minuscule";
    if (!/[0-9]/.test(password))
      return "Le mot de passe doit contenir au moins un chiffre";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "La confirmation du mot de passe est requise";
    if (confirmPassword !== password) return "Les mots de passe ne correspondent pas";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", global: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password,
    );

    if (!token) {
      setErrors((prev) => ({
        ...prev,
        global:
          "Lien invalide ou manquant. Veuillez refaire la demande de reinitialisation.",
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      global: "",
    }));

    if (passwordError || confirmPasswordError) return;

    setIsLoading(true);
    try {
      await resetPasswordRequest(token, formData.password, formData.confirmPassword);
      setIsReset(true);
    
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        global:
          err.response?.data?.message ||
          "Impossible de reinitialiser le mot de passe.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-start relative">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Nouveau
              <br />
              mot de passe
            </h1>
            <p className="text-base leading-relaxed opacity-90">
              Definissez un nouveau mot de passe securise pour votre compte.
            </p>
          </div>
        </div>

        <div className="w-7/12 p-8 flex flex-col justify-center">
          {!isReset ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Reinitialisation
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Entrez votre nouveau mot de passe et sa confirmation.
              </p>

              {errors.global && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errors.global}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label
                    className="block text-gray-800 text-sm font-medium mb-1"
                    htmlFor="password"
                  >
                    Nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border pr-11 ${
                        errors.password
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-200 focus:ring-green-400"
                      }`}
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-gray-800 text-sm font-medium mb-1"
                    htmlFor="confirmPassword"
                  >
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border pr-11 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-200 focus:ring-green-400"
                      }`}
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={
                        showConfirmPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showConfirmPassword ? (
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
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-3 disabled:opacity-60"
                >
                  {isLoading
                    ? "REINITIALISATION..."
                    : "REINITIALISER LE MOT DE PASSE"}
                </button>

                <div className="flex justify-end pt-2">
                  <NavLink
                    to="/login"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:underline underline-offset-4 transition-colors"
                  >
                    Retour a la connexion
                  </NavLink>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Mot de passe modifie
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Redirection vers la page de connexion...
              </p>

              <NavLink
                to="/login"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                SE CONNECTER
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
