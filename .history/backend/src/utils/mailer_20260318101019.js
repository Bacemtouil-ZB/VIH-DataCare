// ─── utils/mailer.js ──────────────────────────────────────────────────────────
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendPasswordConfirmationEmail = async ({
  to,
  nom,
  prenom,
  confirmUrl,
}) => {
  await transporter.sendMail({
    from: `"Clinique" <${process.env.MAIL_USER}>`,
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
