import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../shared/hooks/useAuth.js';
//import { validateSignupForm } from '../../shared/utils/validation.js';
import { useForm } from '../../shared/hooks/useForm.js';
import { AuthContainer, WelcomeSection, FormSection, FormField, SubmitButton } from '../../shared/components/AuthUI.jsx';

function Signup() {
  const navigate = useNavigate();
  const { handleRegister, loading: authLoading, error: authError, setError } = useAuth();
  
  const { 
    formData, 
    setFormData,
    handleChange, 
    errors, 
    setErrors, 
    loading, 
    setLoading,
    successMessage,
    setSuccessMessage 
  } = useForm({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = validateSignupForm(formData, agreeToTerms);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await handleRegister(
        formData.nom.trim(),
        formData.prenom.trim(),
        formData.email.trim().toLowerCase(),
        formData.password
      );
      
      console.log("Inscription réussie:", response);

      setSuccessMessage(
        "Votre compte a été créé avec succès ! Veuillez vérifier votre email pour l'activer."
      );

      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setAgreeToTerms(false);

      // Rediriger après 3 secondes
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: "Compte créé ! Connectez-vous après activation." 
          } 
        });
      }, 3000);
      
    } catch (err) {
      console.error("Erreur d'inscription:", err);
      
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(error => {
          backendErrors[error.field] = error.message;
        });
        setErrors(backendErrors);
      } else if (err.response?.data?.message) {
        setErrors({ 
          submit: err.response.data.message 
        });
      } else if (err.message) {
        setErrors({ 
          submit: err.message 
        });
      } else {
        setErrors({ 
          submit: "Une erreur s'est produite lors de l'inscription" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <WelcomeSection
        subtitleLines={[
          "Rejoignez",
          "Notre Plateforme",
          "Unique",
          "Découvrez Une",
          "Nouvelle Expérience"
        ]}
        buttonText="SE CONNECTER"
        buttonTo="/login"
      />
      
      <FormSection
        title="Inscription"
        successMessage={successMessage}
        error={authError || errors.submit}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Nom *"
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              error={errors.nom}
              placeholder="Votre nom"
              disabled={loading || authLoading}
            />
            
            <FormField
              label="Prénom *"
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              error={errors.prenom}
              placeholder="Votre prénom"
              disabled={loading || authLoading}
            />
          </div>
          
          <FormField
            label="Email *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Entrez votre email"
            disabled={loading || authLoading}
          />
          
          <FormField
            label="Mot de passe *"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Entrez votre mot de passe"
            disabled={loading || authLoading}
            showPasswordToggle={true}
          />
          
          <FormField
            label="Confirmer le mot de passe *"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirmez votre mot de passe"
            disabled={loading || authLoading}
            showPasswordToggle={true}
          />
          
          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => {
                setAgreeToTerms(e.target.checked);
                setErrors(prev => ({ ...prev, terms: "" }));
              }}
              className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-400 mt-0.5"
              disabled={loading || authLoading}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              J'accepte les conditions générales d'utilisation *
            </label>
          </div>
          
          {errors.terms && (
            <p className="text-xs text-red-600 ml-6">{errors.terms}</p>
          )}
          
          <SubmitButton
            loading={loading || authLoading}
            disabled={loading || authLoading}
            className="mt-3"
          >
            {{
              default: "S'INSCRIRE",
              loading: "Inscription en cours..."
            }}
          </SubmitButton>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            * Champs obligatoires
          </p>
        </form>
      </FormSection>
    </AuthContainer>
  );
}

export default Signup;