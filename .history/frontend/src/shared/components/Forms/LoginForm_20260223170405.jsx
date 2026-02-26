import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from './hooks/useLoginForm.js';

const Login = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    localError,
    error,
    loading
  } = useLoginForm();

  const displayError = localError || error;

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
          
          <Link 
            to="/signup" 
            className="mt-6 bg-white text-green-600 font-semibold py-3 px-10 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
          >
            S'INSCRIRE
          </Link>
        </div>

        {/* Section droite - Login Form */}
        <div className="w-7/12 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Connexion</h2>

          {/* Message d'erreur */}
          {displayError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-gray-800 text-sm font-medium mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-200"
                placeholder="Entrez votre email"
                autoComplete="email"
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-800 text-sm font-medium mb-1">
                Mot de passe *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 border border-gray-200"
                placeholder="Entrez votre mot de passe"
                autoComplete="current-password"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting || loading ? 'Connexion en cours...' : 'SE CONNECTER'}
            </button>

            <p className="text-xs text-gray-500 mt-2 text-center">
              * Champs obligatoires
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;