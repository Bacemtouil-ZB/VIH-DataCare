import express from "express";
import dotenv from "dotenv";
import db from "./src/config/db.js"; // pour connecter PostgreSQL
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import ordonnanceRoute from "./src/routes/ordonnanceRoute.js";
import patientOrdRoute from "./src/routes/PatientsOrdRoute.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import vihRoute from "./src/routes/vihRoute.js"; // routes pour VIH
import socialRoutes from "./src/routes/socialRoute.js";
import antecedentRoutes from "./src/routes/antecedentRoutes.js";
import examenCliniqueRoute from "./src/routes/examenClinique/examenCliniqueRoute.js";
import signeClinique from "./src/routes/examenClinique/signeCliniqueRoute.js";
import signeFonctionRoute from "./src/routes/examenClinique/signeFonctionRoute.js";
import habitude from "./src/routes/examenClinique/habitudeDeVieRoute.js";
import observations from "./src/routes/examenClinique/observationRoute.js";
import auditRoutes from "./src/routes/auditRoutes.js";
import rendezvousRouter from "./src/routes/rendezVousRoute.js";
import stockRoute from "./src/routes/stockRoute.js";
import conclusionRoutes from "./src/routes/doctorConclusionsRoutes.js";
import prescriptionMedical from "./src/routes/prescriptionMedicalRoute.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet()); // sets 11 security headers automatically
// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes); // routes pour les utilisateurs (inscription, connexion, profil)
app.use("/api/ordonnances", ordonnanceRoute);
app.use("/api/patients/ordonnances", patientOrdRoute);
app.use("/api/vih", vihRoute);
app.use("/api/patients", patientRoutes); // patients = profil patient
app.use("/api/social", socialRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/antecedents", antecedentRoutes);
app.use("/api/examen-clinique", examenCliniqueRoute);
app.use("/api/signesFonctionnels", signeFonctionRoute);
app.use("/api/signesCliniques", signeClinique);
app.use("/api/habitudes", habitude);
app.use("/api/observations", observations);
app.use("/api/audit", auditRoutes);
app.use("/api/rendezvous", rendezvousRouter);
app.use("/api/stock", stockRoute);
app.use("/api", conclusionRoutes); // routes pour les conclusions du médecin(diffrentes de celles du patient)
app.use("/api/prescription-medicale", prescriptionMedical);

// Fonction pour lancer le serveur après connexion DB
const startServer = async () => {
  try {
    await db.connect(); // test de connexion
    console.log("PostgreSQL connecté, démarrage du serveur...");

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Impossible de se connecter à PostgreSQL :", err);
    process.exit(1); // arrêt du serveur si DB non accessible
  }
};

// this is a global error handler for any unhandled errors in the routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

startServer();
