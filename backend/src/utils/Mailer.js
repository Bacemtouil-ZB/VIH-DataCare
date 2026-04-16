// ─── utils/mailer.js ──────────────────────────────────────────────────────────
// this file represents mails sent to users for account activation, password reset, etc.
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ── Email : confirmation changement de mot de passe ───────────────────────────
export const sendPasswordConfirmationEmail = async ({
  to,
  nom,
  prenom,
  confirmUrl,
}) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Confirmation de changement de mot de passe",
    html: `
      <p>Bonjour ${prenom} ${nom},</p>
      <p>Vous avez demandé à changer votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour confirmer (valable <strong>15 minutes</strong>) :</p>
      <a href="${confirmUrl}" style="
        display:inline-block;
        padding:10px 20px;
        background:#2563eb;
        color:#fff;
        border-radius:6px;
        text-decoration:none;
        font-weight:600;
      ">Confirmer le changement</a>
      <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    `,
  });
};

// ── Email : activation du compte par l'admin ──────────────────────────────────
export const sendActivationEmail = async ({ to, nom, prenom }) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Votre compte a été activé ✅",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #16a34a; margin-bottom: 8px;">Compte activé avec succès</h2>
        <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
        <p>Votre compte a été <strong>activé</strong> par l'administrateur.</p>
        <p>Vous pouvez maintenant vous connecter à la plateforme.</p>
        <a href="${process.env.FRONTEND_URL}/login" style="
          display: inline-block;
          margin-top: 16px;
          padding: 10px 20px;
          background: #16a34a;
          color: #fff;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
        ">Se connecter</a>
        <p style="margin-top: 24px; color: #6b7280; font-size: 0.85rem;">
          Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
        </p>
      </div>
    `,
  });
};

// ── Email : création du compte (en attente d’activation) ─────────────────────
export const sendUserCredentialsEmail = async ({
  to,
  nom,
  prenom,
  role,
}) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Création de votre compte VIH DataCare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #2563eb; margin-bottom: 8px;">
          Compte créé avec succès
        </h2>

        <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>

        <p>
          Votre compte a été créé avec succès sur la plateforme
          <strong>VIH DataCare</strong>.
        </p>

        <div style="margin: 16px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
          <p><strong>Email :</strong> ${to}</p>
          <p><strong>Rôle :</strong> ${role}</p>
          <p><strong>Statut :</strong> En attente d’activation</p>
        </div>

        <p>
          Votre compte est actuellement <strong>en attente d’activation par l’administrateur</strong>.
        </p>

        <p>
          Vous recevrez un nouvel email dès que votre compte sera activé
          et prêt à être utilisé.
        </p>

        <p style="margin-top: 24px; color: #6b7280; font-size: 0.85rem;">
          Merci de patienter jusqu’à la validation de votre accès.
        </p>
      </div>
    `,
  });
};

// ── Email : réinitialisation mot de passe ─────────────────────────────────────
export const sendPasswordResetEmail = async ({
  to,
  nom,
  prenom,
  resetUrl,
}) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Réinitialisation de votre mot de passe VIH DataCare",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #dc2626;">Réinitialisation du mot de passe</h2>
        <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>

        <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>

        <a href="${resetUrl}" style="
          display:inline-block;
          margin-top:16px;
          padding:10px 20px;
          background:#dc2626;
          color:#fff;
          border-radius:6px;
          text-decoration:none;
          font-weight:600;
        ">Réinitialiser le mot de passe</a>

        <p style="margin-top: 16px;">Ce lien expire dans <strong>60 minutes</strong>.</p>

        <p style="margin-top: 24px; color: #6b7280; font-size: 0.85rem;">
          Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
        </p>
      </div>
    `,
  });
};