import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  if (!host || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  return transporter;
};

export const sendUserCredentialsEmail = async ({
  to,
  nom,
  prenom,
  password,
  role,
}) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.warn("SMTP non configure. Email des identifiants non envoye.");
    return;
  }

  const fullName = [prenom, nom].filter(Boolean).join(" ").trim() || "Utilisateur";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await mailer.sendMail({
    from,
    to,
    subject: "Vos acces VIH DataCare",
    text: [
      `Bonjour ${fullName},`,
      "",
      "Votre compte a ete cree avec succes.",
      "",
      `Email: ${to}`,
      `Mot de passe: ${password}`,
      `Role: ${role}`,
      "",
      "Vous pouvez maintenant vous connecter a la plateforme.",
    ].join("\n"),
  });
};

export const sendPasswordResetEmail = async ({
  to,
  nom,
  prenom,
  resetUrl,
}) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.warn("SMTP non configure. Email reset password non envoye.");
    return;
  }

  const fullName = [prenom, nom].filter(Boolean).join(" ").trim() || "Utilisateur";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await mailer.sendMail({
    from,
    to,
    subject: "Reinitialisation de votre mot de passe VIH DataCare",
    text: [
      `Bonjour ${fullName},`,
      "",
      "Vous avez demande une reinitialisation de mot de passe.",
      "Cliquez sur ce lien pour definir un nouveau mot de passe:",
      resetUrl,
      "",
      "Ce lien expire dans 60 minutes.",
      "Si vous n'etes pas a l'origine de cette demande, ignorez cet email.",
    ].join("\n"),
  });
};
