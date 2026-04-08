import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth.js';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin, user, error, setError, loading } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect si connecté
  useEffect(() => {
    if (!user) return;
    const routes = { admin: '/admin', medecin: '/medecin', pharmacien: '/pharmacien', analyste: '/analyste' };
    navigate(routes[user.role] || '/');
  }, [user, navigate]);

  // Toast erreur backend
  useEffect(() => {
    if (!error) return;
    toast.error(error);
    setError(null);
  }, [error, setError]);

  useEffect(() => {
    const stateMessage = location.state?.message;
    if (!stateMessage) return;
    toast.success(stateMessage);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      return toast.warn('Veuillez remplir tous les champs.');
    }
    setIsSubmitting(true);
    try {
      await handleLogin(formData.email.trim(), formData.password.trim());
      toast.success('Connexion réussie !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
      <div className="flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Gauche */}
        <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Bienvenue</h1>
          <p className="text-base opacity-90 leading-relaxed mb-8">
            Rejoignez notre plateforme et découvrez une nouvelle expérience.
          </p>
          <Link to="/signup" className="bg-white text-green-600 font-semibold py-3 px-10 rounded-lg text-center hover:bg-gray-50 transition-all">
            S'INSCRIRE
          </Link>
        </div>

        {/* Droite */}
        <div className="w-7/12 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Entrez votre email" autoComplete="email" disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Entrez votre mot de passe" autoComplete="current-password" disabled={isSubmitting}
                  className="w-full px-3 py-2 pr-10 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}
                  className="w-4 h-4 text-green-500 rounded" disabled={isSubmitting} />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" disabled={isSubmitting || loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {(isSubmitting || loading) ? (
                <>
                  <svg className="animate-spin mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion en cours...
                </>
              ) : 'SE CONNECTER'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../shared/hooks/useAuth.js';
// import { toast } from "react-toastify";
// import hospitalBg from '../../assets/images/lab-bg.png';      
// import hospitalLogo from '../../assets/images/logo.png';       

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { handleLogin, user, error, setError, loading } = useAuth();

//   const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (!user) return;
//     const routes = { admin: '/admin', medecin: '/medecin', pharmacien: '/pharmacien', analyste: '/analyste' };
//     navigate(routes[user.role] || '/');
//   }, [user, navigate]);

//   useEffect(() => {
//     if (!error) return;
//     toast.error(error);
//     setError(null);
//   }, [error, setError]);

//   useEffect(() => {
//     const stateMessage = location.state?.message;
//     if (!stateMessage) return;
//     toast.success(stateMessage);
//     navigate(location.pathname, { replace: true, state: {} });
//   }, [location.pathname, location.state, navigate]);

//   const handleChange = ({ target: { name, value, type, checked } }) =>
//     setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.email.trim() || !formData.password.trim()) {
//       return toast.warn('Veuillez remplir tous les champs.');
//     }
//     setIsSubmitting(true);
//     try {
//       await handleLogin(formData.email.trim(), formData.password.trim());
//       toast.success('Connexion réussie !');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Identifiants incorrects.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     /* Fond avec photo laboratoire */
//     <div
//       className="min-h-screen flex flex-col items-center justify-center p-6"
//       style={{
//         backgroundImage: `url(${hospitalBg})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//       }}
//     >
//       {/* Overlay sombre pour lisibilité */}
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />

//       {/* Logo hôpital en haut à gauche */}
//       <div className="absolute top-6 left-8 flex items-center gap-3 z-10">
//         <img src={hospitalLogo} alt="Logo Hôpital" className="h-12 w-auto drop-shadow-md" />
//         <div className="text-white leading-tight drop-shadow">
//           <p className="text-sm font-bold">Farhat Hached</p>
//           <p className="text-xs opacity-80">Hospital</p>
//         </div>
//       </div>

//       {/* Carte login */}
//       <div className="relative z-10 flex max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">

//         {/* Gauche verte */}
//         <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-center text-center">

//           {/* Icônes déco */}
//           <div className="flex gap-4 mb-6 opacity-90">
//             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//             </svg>
//           </div>

//           <h1 className="text-2xl font-bold mb-3">Suivi Patient & Sécurité.</h1>

//           <Link
//             to="/signup"
//             className="mt-6 border-2 border-white text-white font-semibold py-2 px-10 rounded-lg text-center hover:bg-white hover:text-green-600 transition-all text-sm tracking-widest"
//           >
//             S'INSCRIRE
//           </Link>
//         </div>

//         {/* Droite formulaire */}
//         <div className="w-7/12 p-10 flex flex-col justify-center bg-white">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Connexion</h2>

//           <form onSubmit={handleSubmit} className="space-y-4" noValidate>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
//               <input
//                 type="email" name="email" value={formData.email} onChange={handleChange}
//                 placeholder="votre_email@fh.tn" autoComplete="email" disabled={isSubmitting}
//                 className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 text-sm"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
//                   placeholder="••••••••••" autoComplete="current-password" disabled={isSubmitting}
//                   className="w-full px-3 py-2 pr-10 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 text-sm"
//                 />
//                 <button type="button" onClick={() => setShowPassword(p => !p)} tabIndex={-1}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                   {showPassword
//                     ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
//                     : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
//                   }
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center cursor-pointer">
//                 <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}
//                   className="w-4 h-4 text-green-500 rounded" disabled={isSubmitting} />
//                 <span className="ml-2 text-sm text-gray-500">Se souvenir de moi</span>
//               </label>
//               <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
//                 Besoin d'aide technique ?
//               </Link>
//             </div>

//             <button type="submit" disabled={isSubmitting || loading}
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm tracking-widest">
//               {(isSubmitting || loading) ? (
//                 <>
//                   <svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                   Connexion en cours...
//                 </>
//               ) : 'SE CONNECTER'}
//             </button>

//           </form>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Login;