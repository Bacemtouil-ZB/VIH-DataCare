import React, { useState } from "react";
import { NavLink } from "react-router-dom";
function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register avec:", formData);
  };

  return (
      <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden ">
        
          {/* Section gauche - Welcome */}
          <div className="w-5/12 bg-linear-to-br from-blue-500 to-blue-600 text-white p-12 flex flex-col justify-center items-start relative">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Bienvenue</h1>
            <p className="text-lg leading-relaxed opacity-90">
              Join Our<br />
              Unique<br />
              Platform,<br />
              Explore a New<br />
              Experience
            </p>
          </div>
          
          <NavLink to="/login" className="mt-8 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-10 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
             SE CONNECTER
          </NavLink>
        </div>

        {/* Section droite - Register */}
        <div className="w-7/12 p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Inscription</h2>
          
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Nom Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nom">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
                placeholder="Entrez votre nom"
                required
              />
            </div>

            {/* Prenom Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="prenom">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
                placeholder="Entrez votre prénom"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
                placeholder="Entrez votre email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
                placeholder="Confirmez votre mot de passe"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                J'accepte les conditions générales d'utilisation
              </label>
            </div>

            {/* Register Button */}
            <button
                type="submit"
                className="w-full bg-[#2F80ED]! hover:bg-blue-600 text-white! font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-4"
              >
               S'INSCRIRE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;