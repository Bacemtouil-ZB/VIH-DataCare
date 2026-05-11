// ─── utils/mailer.js ──────────────────────────────────────────────────────────
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


// ─────────────────────────────────────────────────────────────────────────────
// SHARED LAYOUT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  primary:     "#1a5c38",
  primaryDark: "#134529",
  accent:      "#2d7a52",
  bgPage:      "#f0f4f1",
  bgCard:      "#ffffff",
  bgInfo:      "#f4f8f5",
  border:      "#d1e0d7",
  textDark:    "#1e293b",
  textMuted:   "#64748b",
  textLight:   "#94a3b8",
  warning:     "#b45309",
  bgWarning:   "#fffbeb",
  borderWarn:  "#fcd34d",
};

/**
 * Wraps content in the shared email shell:
 * logo header → card body → footer
 */
const layout = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>VIH DataCare</title>
</head>
<body style="
  margin:0; padding:0;
  background-color:${COLORS.bgPage};
  font-family:'Segoe UI', Arial, sans-serif;
  color:${COLORS.textDark};
">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bgPage}; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <!-- ── HEADER ───────────────────────────────────────────── -->
          <tr>
            <td style="
              background:${COLORS.primary};
              border-radius:12px 12px 0 0;
              padding:28px 40px;
              text-align:center;
            ">
              <!-- Logo SVG inline (heart + ECG) -->
              <div style="margin-bottom:12px;">
                <svg width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26 44 C26 44 6 30 6 17.5 C6 11.1 11.1 6 17.5 6 C21.2 6 24.5 7.8 26 10.6 C27.5 7.8 30.8 6 34.5 6 C40.9 6 46 11.1 46 17.5 C46 30 26 44 26 44Z"
                    fill="none" stroke="#ffffff" stroke-width="2.5"/>
                  <polyline points="14,20 19,20 22,14 26,26 30,18 33,22 38,22"
                    fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div style="
                font-size:22px; font-weight:700;
                color:#ffffff; letter-spacing:0.5px;
              ">VIHDataCare</div>
              <div style="
                font-size:12px; color:rgba(255,255,255,0.7);
                letter-spacing:1.5px; text-transform:uppercase;
                margin-top:3px;
              ">Système Médical</div>
            </td>
          </tr>

          <!-- ── CARD BODY ─────────────────────────────────────────── -->
          <tr>
            <td style="
              background:${COLORS.bgCard};
              padding:40px 48px;
              border-left:1px solid ${COLORS.border};
              border-right:1px solid ${COLORS.border};
            ">
              ${content}
            </td>
          </tr>

          <!-- ── FOOTER ───────────────────────────────────────────── -->
          <tr>
            <td style="
              background:${COLORS.primaryDark};
              border-radius:0 0 12px 12px;
              padding:24px 40px;
              text-align:center;
            ">
              <p style="
                margin:0 0 6px 0;
                font-size:13px; font-weight:600;
                color:rgba(255,255,255,0.9);
                letter-spacing:0.3px;
              ">Hôpital Farhat Hached — Sousse, Tunisie</p>
              <p style="
                margin:0;
                font-size:11.5px;
                color:rgba(255,255,255,0.5);
                line-height:1.6;
              ">
                Cet e-mail est généré automatiquement par la plateforme VIHDataCare.<br/>
                Merci de ne pas répondre directement à ce message.
              </p>
              <div style="
                margin-top:14px;
                border-top:1px solid rgba(255,255,255,0.12);
                padding-top:12px;
                font-size:11px;
                color:rgba(255,255,255,0.35);
              ">© ${new Date().getFullYear()} VIHDataCare · Tous droits réservés</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/**
 * Section title with left green accent bar
 */
const sectionTitle = (text, color = COLORS.primary) => `
  <h2 style="
    margin:0 0 20px 0;
    font-size:20px; font-weight:700;
    color:${color};
    padding-left:14px;
    border-left:4px solid ${color};
    line-height:1.3;
  ">${text}</h2>
`;

/**
 * Greeting line
 */
const greeting = (prenom, nom) => `
  <p style="
    margin:0 0 20px 0;
    font-size:15px; color:${COLORS.textDark};
    line-height:1.6;
  ">
    Bonjour <strong>Dr. ${prenom} ${nom}</strong>,
  </p>
`;

/**
 * Body paragraph
 */
const para = (text) => `
  <p style="
    margin:0 0 16px 0;
    font-size:14.5px; color:${COLORS.textDark};
    line-height:1.7;
  ">${text}</p>
`;

/**
 * Info box (grey-green tinted)
 */
const infoBox = (rows) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="
    background:${COLORS.bgInfo};
    border:1px solid ${COLORS.border};
    border-radius:8px;
    margin:20px 0;
  ">
    ${rows.map(([label, value]) => `
    <tr>
      <td style="
        padding:11px 18px;
        font-size:13.5px;
        color:${COLORS.textMuted};
        font-weight:600;
        width:42%;
        border-bottom:1px solid ${COLORS.border};
      ">${label}</td>
      <td style="
        padding:11px 18px;
        font-size:13.5px;
        color:${COLORS.textDark};
        border-bottom:1px solid ${COLORS.border};
      ">${value}</td>
    </tr>`).join("")}
  </table>
`;

/**
 * CTA button
 */
const button = (label, url, color = COLORS.accent) => `
  <div style="text-align:center; margin:28px 0 20px 0;">
    <a href="${url}" style="
      display:inline-block;
      padding:13px 32px;
      background:${color};
      color:#ffffff;
      font-size:14.5px; font-weight:700;
      border-radius:8px;
      text-decoration:none;
      letter-spacing:0.3px;
      box-shadow:0 2px 6px rgba(0,0,0,0.15);
    ">${label}</a>
  </div>
`;

/**
 * Warning notice box
 */
const warningBox = (text) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="
    background:${COLORS.bgWarning};
    border:1px solid ${COLORS.borderWarn};
    border-radius:8px;
    margin:20px 0 0 0;
  ">
    <tr>
      <td style="padding:12px 18px; font-size:13px; color:${COLORS.warning}; line-height:1.6;">
        ⚠️ ${text}
      </td>
    </tr>
  </table>
`;

/**
 * Divider
 */
const divider = () => `
  <hr style="border:none; border-top:1px solid ${COLORS.border}; margin:24px 0;" />
`;

/**
 * Small muted footer note inside the card
 */
const cardNote = (text) => `
  <p style="
    margin:16px 0 0 0;
    font-size:12.5px;
    color:${COLORS.textLight};
    line-height:1.6;
  ">${text}</p>
`;


// ─────────────────────────────────────────────────────────────────────────────
// 1. CONFIRMATION CHANGEMENT DE MOT DE PASSE
// ─────────────────────────────────────────────────────────────────────────────
export const sendPasswordConfirmationEmail = async ({ to, nom, prenom, confirmUrl }) => {
  const html = layout(`
    ${sectionTitle("Confirmation de changement de mot de passe")}
    ${greeting(prenom, nom)}
    ${para("Une demande de <strong>changement de mot de passe</strong> a été initiée pour votre compte VIHDataCare.")}
    ${para("Pour valider cette modification, veuillez cliquer sur le bouton ci-dessous :")}
    ${button("✔ Confirmer le changement de mot de passe", confirmUrl)}
    ${warningBox("Ce lien est valable <strong>15 minutes</strong>. Passé ce délai, vous devrez soumettre une nouvelle demande.")}
    ${divider()}
    ${cardNote("Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail. Votre mot de passe restera inchangé.")}
  `);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "[VIHDataCare] Confirmation de changement de mot de passe",
    html,
  });
};


// ─────────────────────────────────────────────────────────────────────────────
// 2. ACTIVATION DU COMPTE PAR L'ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export const sendActivationEmail = async ({ to, nom, prenom }) => {
  const html = layout(`
    ${sectionTitle("Votre compte a été activé")}
    ${greeting(prenom, nom)}
    ${para("Nous avons le plaisir de vous informer que votre compte sur la plateforme <strong>VIHDataCare</strong> a été <strong>activé avec succès</strong> par l'administrateur.")}
    ${para("Vous pouvez désormais accéder à l'ensemble des fonctionnalités de la plateforme en vous connectant via le lien ci-dessous :")}
    ${button("→ Accéder à VIHDataCare", `${process.env.FRONTEND_URL}/login`)}
    ${divider()}
    ${cardNote("Pour toute question ou difficulté de connexion, veuillez contacter l'administrateur de la plateforme.")}
  `);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "[VIHDataCare] Votre compte est maintenant actif",
    html,
  });
};


// ─────────────────────────────────────────────────────────────────────────────
// 3. CRÉATION DU COMPTE (EN ATTENTE D'ACTIVATION)
// ─────────────────────────────────────────────────────────────────────────────
export const sendUserCredentialsEmail = async ({ to, nom, prenom, role }) => {
  const html = layout(`
    ${sectionTitle("Création de votre compte VIHDataCare")}
    ${greeting(prenom, nom)}
    ${para("Votre compte a été créé avec succès sur la plateforme <strong>VIHDataCare</strong>. Vous trouverez ci-dessous le récapitulatif de vos informations d'accès :")}
    ${infoBox([
      ["Adresse e-mail",  to],
      ["Rôle assigné",    role],
      ["Statut du compte", "En attente d'activation"],
    ])}
    ${para("Votre compte est actuellement <strong>en attente de validation</strong> par l'administrateur. Vous recevrez un e-mail de confirmation dès que votre accès sera activé.")}
    ${divider()}
    ${cardNote("Si vous pensez avoir reçu cet e-mail par erreur, veuillez contacter l'administrateur de la plateforme.")}
  `);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "[VIHDataCare] Création de votre compte — En attente d'activation",
    html,
  });
};


// ─────────────────────────────────────────────────────────────────────────────
// 4. RÉINITIALISATION DU MOT DE PASSE
// ─────────────────────────────────────────────────────────────────────────────
export const sendPasswordResetEmail = async ({ to, nom, prenom, resetUrl }) => {
  const html = layout(`
    ${sectionTitle("Réinitialisation de votre mot de passe", "#b91c1c")}
    ${greeting(prenom, nom)}
    ${para("Nous avons reçu une demande de <strong>réinitialisation du mot de passe</strong> associé à votre compte VIHDataCare.")}
    ${para("Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :")}
    ${button("→ Réinitialiser mon mot de passe", resetUrl, "#b91c1c")}
    ${warningBox("Ce lien expire dans <strong>60 minutes</strong>. Passé ce délai, vous devrez soumettre une nouvelle demande de réinitialisation.")}
    ${divider()}
    ${cardNote("Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail. Votre mot de passe restera inchangé. En cas de doute, contactez immédiatement l'administrateur.")}
  `);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "[VIHDataCare] Réinitialisation de votre mot de passe",
    html,
  });
};