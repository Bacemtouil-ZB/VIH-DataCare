import express from "express";
import dotenv from "dotenv";
import db from "./src/config/db.js"; // pour connecter PostgreSQL
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import ordonnanceRoute from "./src/routes/ordonnanceRoute.js";
import patientOrdRoute from "./src/routes/PatientsOrdRoute.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import vihRoute from "./src/routes/vihRoute.js";
import socialRoutes from "./src/routes/socialRoute.js";
import vih from "./src/routes/vihRoute.js";
import antecedentRoutes from "./src/routes/antecedentRoutes.js";
import examenCliniqueRoute from "./src/routes/examenClinique/examenCliniqueRoute.js";
import signeClinique from "./src/routes/examenClinique/signeCliniqueRoute.js";
import signeFonctionRoute from "./src/routes/examenClinique/signeFonctionRoute.js";
import habitude from "./src/routes/examenClinique/habitudeDeVieRoute.js";
import observations from "./src/routes/examenClinique/observationRoute.js";
import auditRoutes from "./src/routes/auditRoutes.js";
import rendezvousRouter from "./src/routes/rendezVousRoute.js";
import stockRoute from "./src/routes/stockRoute.js";
import conclusionRoutes from "./src/routes/conclusionRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Routes d'authentification
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/ordonnances", ordonnanceRoute);
app.use("/api/patients/ordonnances", patientOrdRoute);
app.use("/api/vih", vihRoute);
app.use("/api/patients", patientRoutes); // patients = profil patient
app.use("/api/social", socialRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/vih", vih);
app.use("/api/antecedents", antecedentRoutes);
app.use("/api/examen-clinique", examenCliniqueRoute);
app.use("/api/signesFonctionnels", signeFonctionRoute);
app.use("/api/signesCliniques", signeClinique);
app.use("/api/habitudes", habitude);
app.use("/api/observations", observations);
app.use("/api/audit", auditRoutes);
app.use("/api/rendezvous", rendezvousRouter);
app.use("/api/stock", stockRoute);
app.use("/api/audit", auditRoutes);
app.use("/api", conclusionRoutes);

// Route racine test
app.get("/", (req, res) => {
  res.send("Backend VIHDATACARE fonctionne !");
});

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

startServer();
