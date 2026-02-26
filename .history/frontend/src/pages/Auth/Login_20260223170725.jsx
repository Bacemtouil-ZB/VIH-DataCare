// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../shared/hooks/useAuth.js';
// import { toast } from "react-toastify";
// const Login = () => {
//   const navigate = useNavigate();
//   const { handleLogin, user, error, setError, loading } = useAuth();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });

//   const [localError, setLocalError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Rediriger si déjà connecté
//   useEffect(() => {
//     if (user) {
//       // Rediriger selon le rôle
//       switch (user.role) {
//         case 'admin':
//           navigate('/admin');
//           break;
//         case 'medecin':
//           navigate('/medecin');
//           break;
//         case 'pharmacien':
//           navigate('/pharmacien');
//           break;
//         case 'analyste':
//           navigate('/analyste');
//           break;
//         default:
//           navigate('/');
//       }
//     }
//   }, [user, navigate]);

//   // Nettoyer les erreurs quand on modifie le formulaire
//   useEffect(() => {
//     if (error) setError(null);
//     if (localError) setLocalError('');
//   }, [formData.email, formData.password, formData.rememberMe, error, setError, localError]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLocalError('');
//     setIsSubmitting(true);

//     if (!formData.email.trim() || !formData.password.trim()) {
//       setLocalError('Tous les champs sont requis');
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       await handleLogin(formData.email.trim(), formData.password.trim());
//     } catch (err) {
//       console.error('Erreur de connexion:', err);
//       setLocalError(
//         err.response?.data?.message || 'Erreur de connexion, vérifiez vos identifiants'
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const displayError = localError || error;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
//       <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        
//         {/* Section gauche - Welcome */}
//         <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-start relative">
//           <div className="mb-6">
//             <h1 className="text-4xl font-bold mb-4 leading-tight">Bienvenue</h1>
//             <p className="text-base leading-relaxed opacity-90">
//               Rejoignez<br />
//               Notre Plateforme<br />
//               Unique<br />
//               Découvrez Une<br />
//               Nouvelle Expérience
//             </p>
//           </div>
          
//           <Link 
//             to="/signup" 
//             className="mt-6 bg-white text-green-600 font-semibold py-3 px-10 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
//           >
//             S'INSCRIRE
//           </Link>
//         </div>

//         {/* Section droite - Login Form */}
//         <div className="w-7/12 p-8 flex flex-col justify-center">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Connexion</h2>

//           {/* Message d'erreur */}
//           {displayError && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <p className="text-sm text-red-700">{displayError}</p>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-3">
//             {/* Email Input */}
//             <div>
//               <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">
//                 Email *
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 border border-gray-200"
//                 placeholder="Entrez votre email"
//                 autoComplete="email"
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>

//             {/* Password Input */}
//             <div>
//               <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="password">
//                 Mot de passe *
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400 border border-gray-200"
//                 placeholder="Entrez votre mot de passe"
//                 autoComplete="current-password"
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>

//             {/* Se souvenir / Mot de passe oublié */}
//             <div className="flex items-center justify-between pt-1">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400"
//                   disabled={isSubmitting}
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
//               </label>
//               <Link 
//                 to="/forgot-password" 
//                 className="text-sm text-green-600 hover:text-green-700 font-medium"
//               >
//                 Mot de passe oublié ?
//               </Link>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting || loading}
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {isSubmitting || loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Connexion en cours...
//                 </>
//               ) : (
//                 'SE CONNECTER'
//               )}
//             </button>

//             {/* Info */}
//             <p className="text-xs text-gray-500 mt-2 text-center">
//               * Champs obligatoires
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/features/auth/hooks/useLoginForm.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth.js';


export const useLoginForm = () => {
  const navigate = useNavigate();
  const { handleLogin, user, error, setError, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirection si connecté
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'admin': return navigate('/admin');
        case 'medecin': return navigate('/medecin');
        case 'pharmacien': return navigate('/pharmacien');
        case 'analyste': return navigate('/analyste');
        default: return navigate('/');
      }
    }
  }, [user, navigate]);

  // Nettoyer les erreurs sur modification du formulaire
  useEffect(() => {
    if (error) setError(null);
    if (localError) setLocalError('');
  }, [formData, error, setError, localError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    if (!formData.email.trim() || !formData.password.trim()) {
      const msg = 'Tous les champs sont requis';
      setLocalError(msg);
      toast.error(msg);
      setIsSubmitting(false);
      return;
    }

    try {
      await handleLogin(formData.email.trim(), formData.password.trim());
      toast.success('Connexion réussie');
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur de connexion, vérifiez vos identifiants';
      setLocalError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    localError,
    error,
    loading
  };
};