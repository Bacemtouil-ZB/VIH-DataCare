import {
  User, Mail, Lock, Eye, EyeOff, Save, Shield, 
} from "lucide-react";
import { ROLE_LABELS } from "./Profil.constants.js";
import { getInitials} from "./Profil.helpers.js";
import "./Profil.css";


export function ProfileHeader({ user }) {
  return (
    <div className="profil-header-card">
      <div className="profil-avatar">{getInitials(user)}</div>

      <div className="profil-header-info">
        <h1 className="profil-header-name">{user.prenom} {user.nom}</h1>

        <div className="profil-header-meta">
          <span className="profil-badge profil-badge--role">
            <Shield size={11} />
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── InfoSection ──────────────────────────────────────────────────────────────

export function InfoSection({ form, errors, loading, isDirty, setField, onSubmit }) {
  return (
    <section className="profil-card">
      <div className="profil-card-header">
        <User size={15} className="profil-card-icon" />
        <h2 className="profil-card-title">Informations personnelles</h2>
      </div>

      <form onSubmit={onSubmit} className="profil-form">
        <div className="profil-row">
          <InputField
            label="Prénom"
            value={form.prenom}
            onChange={(v) => setField("prenom", v)}
            error={errors.prenom}
            placeholder="Votre prénom"
          />
          <InputField
            label="Nom"
            value={form.nom}
            onChange={(v) => setField("nom", v)}
            error={errors.nom}
            placeholder="Votre nom"
          />
        </div>

        <InputField
          label="Adresse e-mail"
          type="email"
          value={form.email}
          onChange={(v) => setField("email", v)}
          error={errors.email}
          placeholder="votre@email.com"
          icon={<Mail size={14} />}
        />

        <div className="profil-form-footer">
          {isDirty && (
            <span className="profil-unsaved-hint">
              Modifications non sauvegardées
            </span>
          )}
          <button
            type="submit"
            className={`profil-btn ${loading || !isDirty ? "profil-btn--disabled" : "profil-btn--primary"}`}
            disabled={loading || !isDirty}
          >
            <Save size={14} />
            {loading ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </section>
  );
}

// ─── PasswordSection ──────────────────────────────────────────────────────────

export function PasswordSection({ form, errors, loading, visibility, setField, toggleVisibility, onSubmit }) {
  return (
    <section className="profil-card">
      <div className="profil-card-header">
        <Lock size={15} className="profil-card-icon" />
        <h2 className="profil-card-title">Mot de passe</h2>
      </div>

      <form onSubmit={onSubmit} className="profil-form">
        <PasswordField
          label="Mot de passe actuel"
          value={form.currentPassword}
          onChange={(v) => setField("currentPassword", v)}
          error={errors.currentPassword}
          show={visibility.currentPassword}
          onToggle={() => toggleVisibility("currentPassword")}
          placeholder="••••••••"
        />
        <PasswordField
          label="Nouveau mot de passe"
          value={form.newPassword}
          onChange={(v) => setField("newPassword", v)}
          error={errors.newPassword}
          show={visibility.newPassword}
          onToggle={() => toggleVisibility("newPassword")}
          placeholder="Minimum 8 caractères"
          hint="Au moins 8 caractères"
        />
        <PasswordField
          label="Confirmer le mot de passe"
          value={form.confirmPassword}
          onChange={(v) => setField("confirmPassword", v)}
          error={errors.confirmPassword}
          show={visibility.confirmPassword}
          onToggle={() => toggleVisibility("confirmPassword")}
          placeholder="••••••••"
        />

        <div className="profil-form-footer profil-form-footer--end">
          <button
            type="submit"
            className={`profil-btn ${loading ? "profil-btn--disabled" : "profil-btn--primary"}`}
            disabled={loading}
          >
            <Lock size={14} />
            {loading ? "Modification…" : "Modifier le mot de passe"}
          </button>
        </div>
      </form>
    </section>
  );
}

// ─── InputField ───────────────────────────────────────────────────────────────

export function InputField({ label, value, onChange, error, placeholder, type = "text", icon }) {
  return (
    <div className="profil-field">
      <label className="profil-label">{label}</label>
      <div className={`profil-input-wrap ${error ? "profil-input-wrap--error" : ""}`}>
        {icon && <span className="profil-input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`profil-input ${icon ? "profil-input--with-icon" : ""}`}
        />
      </div>
      {error && <span className="profil-error-msg">{error}</span>}
    </div>
  );
}

// ─── PasswordField ────────────────────────────────────────────────────────────

export function PasswordField({ label, value, onChange, error, show, onToggle, placeholder, hint }) {
  return (
    <div className="profil-field">
      <label className="profil-label">{label}</label>
      <div className={`profil-input-wrap ${error ? "profil-input-wrap--error" : ""}`}>
        <span className="profil-input-icon"><Lock size={14} /></span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="profil-input profil-input--with-toggle"
        />
        <button type="button" onClick={onToggle} className="profil-eye-btn">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <span className="profil-error-msg">{error}</span>}
      {hint && !error && <span className="profil-hint-msg">{hint}</span>}
    </div>
  );
}
