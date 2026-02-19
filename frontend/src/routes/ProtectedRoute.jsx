import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth.js';


const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  // console.log("ProtectedRoute", { user, loading }); // pour tester et voir les données est bien récupérées du contexte authContext.jsx(cors)
  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si pas authentifié
  if (!user) {
    return <Navigate to="/login" replace />; //  probleme : tu rafraîchis la page :Tout le React state est réinitialisé (y compris ton contexte authContext)

  }

  // Vérifier le rôle si spécifié
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Accès Refusé</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Rôle requis : {allowedRoles.join(', ')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Vérifier si le compte est activé
  if (user.isActivated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Compte Non Activé</h2>
          <p className="text-gray-600 mb-4">
            Votre compte n'est pas encore activé. Veuillez vérifier votre email pour activer votre compte.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  // Tout est OK, rendre le composant enfant
  return children;
};

export default ProtectedRoute;