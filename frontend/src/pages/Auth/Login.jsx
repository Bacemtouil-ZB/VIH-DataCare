import React, { useState } from "react";
import { NavLink } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login avec:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center p-6">
      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Section gauche - Welcome */}
        <div className="w-5/12 bg-linear-to-br from-blue-500 to-blue-600 text-white p-12 flex flex-col justify-center items-start relative">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Bienvenue</h1>
            <p className="text-lg leading-relaxed opacity-90">
              Rejoignez<br />
              Notre Plateforme<br />
              Unique<br />
              Découvrez Une<br />
              Nouvelle Expérience
            </p>
          </div>
          
          <NavLink to="/signup" className="mt-8 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-10 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
            S'INSCRIRE
          </NavLink>
        </div>

        {/* Section droite - Sign In */}
        <div className="w-7/12 p-12 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Connecter</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-400"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Se souvenir de moi
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#2F80ED]! hover:bg-blue-600 text-white! font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-6"
            >
              SE CONNECTER
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;