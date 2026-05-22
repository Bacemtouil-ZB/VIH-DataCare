import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../../shared/hooks/useAuth.js';
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const { handleRegister, loading, error: authError, setError } = useAuth();

  const [formData, setFormData] = useState({
    nom: "", prenom: "", email: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast erreur backend
  useEffect(() => {
    if (!authError) return;
    toast.error(authError);
    setError(null);
  }, [authError, setError]);

  const validate = () => {
    const e = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nom.trim() || formData.nom.trim().length < 2)
      e.nom = "Nom requis (min. 2 caractères)";
    if (!formData.prenom.trim() || formData.prenom.trim().length < 2)
      e.prenom = "Prénom requis (min. 2 caractères)";
    if (!formData.email || !emailRegex.test(formData.email))
      e.email = "Email invalide";
    if (!formData.password || formData.password.length < 8)
      e.password = "Min. 8 caractères";
    else if (!/[A-Z]/.test(formData.password))
      e.password = "Doit contenir une majuscule";
    else if (!/[a-z]/.test(formData.password))
      e.password = "Doit contenir une minuscule";
    else if (!/[0-9]/.test(formData.password))
      e.password = "Doit contenir un chiffre";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Les mots de passe ne correspondent pas";

    return e;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.warn("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    try {
      await handleRegister(
        formData.nom.trim(),
        formData.prenom.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );
      toast.success("Compte créé ! Email envoyé après activation.");
      setFormData({ nom: "", prenom: "", email: "", password: "", confirmPassword: "" });


      setTimeout(() => navigate('/login'), 3000); // 3000ms = 3s

    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(e => { backendErrors[e.field] = e.message; });
        setErrors(backendErrors);
      } else {
        toast.error(err.response?.data?.message || err.message || "Erreur lors de l'inscription.");
      }
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 bg-gray-100 text-black rounded-lg border focus:outline-none focus:ring-2 placeholder-gray-400 ${
      errors[field] ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-green-400'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <NavLink
        to="/"
        aria-label="Retour a l'accueil"
        className="absolute left-8 top-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 no-underline shadow-md transition-all hover:-translate-y-0.5 hover:text-gray-800 hover:no-underline hover:shadow-lg"
      >
        <span aria-hidden="true" className="text-xl leading-none">&larr;</span>
      </NavLink>

      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Gauche */}
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Bienvenue</h1>
          <p className="text-base opacity-90 leading-relaxed mb-8">
            Rejoignez notre plateforme et découvrez une nouvelle expérience.
          </p>
          <NavLink to="/login" className="bg-white text-green-600 font-semibold py-3 px-10 rounded-lg text-center no-underline hover:bg-gray-50 hover:no-underline transition-all">
            SE CONNECTER
          </NavLink>
        </div>

        {/* Droite */}
        <div className="w-7/12 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Inscription</h2>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>

            {/* Nom & Prénom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange}
                  placeholder="Votre nom" disabled={loading} className={inputClass('nom')} />
                {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange}
                  placeholder="Votre prénom" disabled={loading} className={inputClass('prenom')} />
                {errors.prenom && <p className="mt-1 text-xs text-red-500">{errors.prenom}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Entrez votre email" disabled={loading} className={inputClass('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Entrez votre mot de passe"
                  disabled={loading}
                  className={`${inputClass('password')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
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
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmez votre mot de passe"
                  disabled={loading}
                  className={`${inputClass('confirmPassword')} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>


            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Inscription en cours...
                </>
              ) : "S'INSCRIRE"}
            </button>

            <p className="text-xs text-gray-500 text-center">* Champs obligatoires</p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Signup;