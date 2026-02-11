import React from 'react';
import { NavLink } from 'react-router-dom';

// Section de bienvenue commune
export const WelcomeSection = ({ 
  title = "Bienvenue", 
  subtitleLines = [],
  buttonText, 
  buttonTo,
  showIcon = false,
  icon = null
}) => (
  <div className="w-5/12 bg-gradient-to-br from-green-500 to-green-600 text-white p-10 flex flex-col justify-center items-start relative">
    {showIcon && icon && (
      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
    )}
    
    <div className="mb-6">
      <h1 className="text-4xl font-bold mb-4 leading-tight">{title}</h1>
      <p className="text-base leading-relaxed opacity-90">
        {subtitleLines.map((line, index) => (
          <React.Fragment key={index}>
            {line}
            {index < subtitleLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    </div>
    
    {buttonText && buttonTo && (
      <NavLink 
        to={buttonTo}
        className="mt-6 bg-white text-green-600 font-semibold py-3 px-10 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
      >
        {buttonText}
      </NavLink>
    )}
  </div>
);

// Container principal
export const AuthContainer = ({ children, className = "" }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center p-6">
    <div className={`flex max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  </div>
);

// Section du formulaire
export const FormSection = ({ 
  title, 
  description, 
  children, 
  successMessage, 
  error 
}) => (
  <div className="w-7/12 p-8 flex flex-col justify-center">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
    
    {description && (
      <p className="text-gray-600 mb-6">{description}</p>
    )}
    
    {/* Message de succès */}
    {successMessage && (
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      </div>
    )}

    {/* Erreur globale */}
    {error && (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    )}
    
    {children}
  </div>
);

// Champ de formulaire avec validation
export const FormField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  className = "",
  showPasswordToggle = false,
  onTogglePassword = () => {}
}) => (
  <div>
    <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={name}>
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 placeholder-gray-400 border ${
          error ? 'border-red-500 focus:ring-red-400' : 'border-gray-200 focus:ring-green-400'
        } ${className}`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {type === 'password' ? '👁️' : '🙈'}
        </button>
      )}
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-600">{error}</p>
    )}
  </div>
);

// Bouton de soumission avec état de chargement
export const SubmitButton = ({
  loading,
  children,
  disabled = false,
  className = ""
}) => (
  <button
    type="submit"
    className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
    disabled={disabled || loading}
  >
    {loading ? (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {children.loading || "Traitement en cours..."}
      </>
    ) : (
      children.default
    )}
  </button>
);