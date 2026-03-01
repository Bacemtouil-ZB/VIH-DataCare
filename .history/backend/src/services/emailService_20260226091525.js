import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // ou SMTP professionnel
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"VIHDataCare" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email envoyé avec succès");
  } catch (error) {
    console.error("Erreur envoi email:", error);
    throw error;
  }
};
