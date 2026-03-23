// ─── profil.ui.jsx ────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  User, Mail, Lock, Eye, EyeOff,
  Save, Shield, CheckCircle, XCircle,
} from "lucide-react";
import { ROLE_LABELS } from "./profil.constants";
import { getInitials, formatFrDate } from "./Profil.helpers.js";

// ─── Styles ──────────────────────────────────────────────────────────────────

const C = {
  bg: "#f8f9fb",
  surface: "#ffffff",
  border: "#e8eaed",
  borderFocus: "#2563eb",
  borderError: "#ef4444",
  text: "#111827",
  muted: "#6b7280",
  accent: "#2563eb",
  success: "#16a34a",
  error: "#ef4444",
  disabled: "#9ca3af",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
};

export const S = {
  page: {
    minHeight: "100vh",
    background: C.bg,
    padding: "2rem 1.5rem",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: 880,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  // Header
  headerCard: {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "1.5rem 1.75rem",
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
    boxShadow: C.shadow,
  },
  avatar: {
    width: 52, height: 52, borderRadius: "50%",
    background: "#dbeafe", color: C.accent,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 700, letterSpacing: 1, flexShrink: 0,
  },
  headerInfo: { display: "flex", flexDirection: "column", gap: 6 },
  headerName: { margin: 0, fontSize: 17, fontWeight: 600, color: C.text },
  headerMeta: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  roleBadge: {
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "#eff6ff", color: C.accent,
    fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20,
  },
  activeBadge: {
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "#f0fdf4", color: C.success,
    fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20,
  },
  inactiveBadge: {
    display: "inline-flex", alignItems: "center", gap: 4,
    background: "#fef2f2", color: C.error,
    fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20,
  },
  dateMeta: { fontSize: 12, color: C.muted },
  // Grid
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
  // Card
  card: {
    background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "1.5rem 1.75rem", boxShadow: C.shadow,
  },
  cardHeader: {
    display: "flex", alignItems: "center", gap: 8,
    marginBottom: "1.5rem", paddingBottom: "1rem",
    borderBottom: `1px solid ${C.border}`,
  },
  cardIcon: { color: C.accent },
  cardTitle: { margin: 0, fontSize: 14, fontWeight: 600, color: C.text },
  // Form
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
  // Field
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12, fontWeight: 500, color: C.muted, letterSpacing: 0.2 },
  inputWrap: {
    position: "relative", display: "flex", alignItems: "center",
    border: `1px solid ${C.border}`, borderRadius: 8,
    background: "#fafafa",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  inputFocused: {
    borderColor: C.borderFocus,
    boxShadow: "0 0 0 3px rgba(37,99,235,0.08)",
    background: "#fff",
  },
  inputError: { borderColor: C.borderError },
  inputIcon: {
    position: "absolute", left: "0.7rem", color: C.muted,
    display: "flex", alignItems: "center", pointerEvents: "none",
  },
  input: {
    width: "100%", padding: "0.6rem 0.85rem",
    border: "none", background: "transparent",
    fontSize: 13, color: C.text, outline: "none", boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: "0.7rem",
    background: "none", border: "none",
    color: C.muted, cursor: "pointer",
    display: "flex", alignItems: "center", padding: 0,
  },
  errorMsg: { fontSize: 11, color: C.error },
  hintMsg: { fontSize: 11, color: C.muted },
  // Footer
  formFooter: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginTop: 4,
  },
  unsavedHint: { fontSize: 11, color: "#d97706" },
  // Button
  btn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "0.55rem 1.1rem", borderRadius: 8, border: "none",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    transition: "background 0.15s",
  },
  btnPrimary: { background: C.accent, color: "#fff" },
  btnDisabled: { background: C.border, color: C.disabled, cursor: "not-allowed" },
};

// ─── ProfileHeader ─────────────────────────────────────────────────────────────

export function ProfileHeader({ user }) {
  return (
    <div style={S.headerCard}>
      <div style={S.avatar}>{getInitials(user)}</div>
      <div style={S.headerInfo}>
        <h1 style={S.headerName}>{user.prenom} {user.nom}</h1>
        <div style={S.headerMeta}>
          <span style={S.roleBadge}>
            <Shield size={11} />
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
          {user.isactivated ? (
            <span style={S.activeBadge}>
              <CheckCircle size={11} /> Actif
            </span>
          ) : (
            <span style={S.inactiveBadge}>
              <XCircle size={11} /> Inactif
            </span>
          )}
          <span style={S.dateMeta}>
            Membre depuis le {formatFrDate(user.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── InfoSection ──────────────────────────────────────────────────────────────

export function InfoSection({ form, errors, loading, isDirty, setField, onSubmit }) {
  return (
    <section style={S.card}>
      <div style={S.cardHeader}>
        <User size={15} style={S.cardIcon} />
        <h2 style={S.cardTitle}>Informations personnelles</h2>
      </div>

      <form onSubmit={onSubmit} style={S.form}>
        <div style={S.row}>
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

        <div style={S.formFooter}>
          {isDirty && (
            <span style={S.unsavedHint}>Modifications non sauvegardées</span>
          )}
          <button
            type="submit"
            style={{ ...S.btn, ...(loading || !isDirty ? S.btnDisabled : S.btnPrimary) }}
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
    <section style={S.card}>
      <div style={S.cardHeader}>
        <Lock size={15} style={S.cardIcon} />
        <h2 style={S.cardTitle}>Mot de passe</h2>
      </div>

      <form onSubmit={onSubmit} style={S.form}>
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

        <div style={{ ...S.formFooter, justifyContent: "flex-end" }}>
          <button
            type="submit"
            style={{ ...S.btn, ...(loading ? S.btnDisabled : S.btnPrimary) }}
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
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <div style={{
        ...S.inputWrap,
        ...(focused ? S.inputFocused : {}),
        ...(error ? S.inputError : {}),
      }}>
        {icon && <span style={S.inputIcon}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{ ...S.input, paddingLeft: icon ? "2.2rem" : "0.85rem" }}
        />
      </div>
      {error && <span style={S.errorMsg}>{error}</span>}
    </div>
  );
}

// ─── PasswordField ────────────────────────────────────────────────────────────

export function PasswordField({ label, value, onChange, error, show, onToggle, placeholder, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      <div style={{
        ...S.inputWrap,
        ...(focused ? S.inputFocused : {}),
        ...(error ? S.inputError : {}),
      }}>
        <span style={S.inputIcon}><Lock size={14} /></span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{ ...S.input, paddingLeft: "2.2rem", paddingRight: "2.4rem" }}
        />
        <button type="button" onClick={onToggle} style={S.eyeBtn}>
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <span style={S.errorMsg}>{error}</span>}
      {hint && !error && <span style={S.hintMsg}>{hint}</span>}
    </div>
  );
}