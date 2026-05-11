import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import db from "./src/config/db.js";


import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import prescriptionWorkflowRoute from "./src/routes/prescriptionWorkflowRoute.js";
import patientPrescriptionRoute from "./src/routes/patientPrescriptionRoute.js";
import addressRoutes from "./src/routes/addressRoutes.js";
import vihRoute from "./src/routes/vihRoute.js";
import socialRoutes from "./src/routes/socialRoute.js";
import antecedentRoutes from "./src/routes/antecedentRoutes.js";
import examenCliniqueRoute from "./src/routes/examenClinique/examenCliniqueRoute.js";
import signeCliniqueRoute from "./src/routes/examenClinique/signeCliniqueRoute.js";
import signeFonctionRoute from "./src/routes/examenClinique/signeFonctionRoute.js";
import observationRoute from "./src/routes/examenClinique/observationRoute.js";
import auditRoutes from "./src/routes/auditRoutes.js";
import rendezvousRouter from "./src/routes/rendezVousRoute.js";
import stockRoute from "./src/routes/stockRoute.js";
import conclusionRoutes from "./src/routes/doctorConclusionsRoutes.js";
import mobileAuthRoutes from "./src/routes/mobile/mobileAuthRoutes.js";
import mobilePatientRoutes from "./src/routes/mobile/mobilePatientRoutes.js";
import mobileRendezvousRoutes from "./src/routes/mobile/mobileRendezvousRoutes.js";
import bilanExamenRoute from "./src/routes/bilanExamenRoute.js";
import resultatBiologiqueRoute from "./src/routes/resultatBiologiqueRoute.js";
import suiviBiologiqueRoute from "./src/routes/Suivibiologiqueroute.js";
import suiviNotificationRoute from "./src/routes/suiviNotificationRoute.js";
import permissionRoutes from "./src/routes/permissionRoutes.js";
import emergencyContactRoutes from "./src/routes/emergencyContactRoutes.js";
import biRoutes from "./src/routes/biRoutes.js";
// mobile Scheduler
import { startScheduler } from './src/services/mobile/mobileScheduler.js';
import { startBiRefreshJob , startStatutsJob , startNotificationsJob ,startCleanupNotificationsJob} from "./src/utils/scheduler.js";



dotenv.config();

const app = express();

// Configuration des middlewares avec limites augmentées pour les fichiers
app.use(express.json({ limit: '100mb' })); // This is Express’s built‑in JSON body parser middleware. pyleoad like images
app.use(express.urlencoded({ limit: '100mb', extended: true })); // translate form data into json 
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, //Allows the browser to include cookies in cross-origin requests.
  }),
);

// Start the rendezvous notification scheduler
startScheduler();

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/prescription-medicale", prescriptionWorkflowRoute);
app.use("/api/patients/prescriptions-medicales", patientPrescriptionRoute);
app.use("/api/vih", vihRoute);
app.use("/api/patients", patientRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/antecedents", antecedentRoutes);
app.use("/api/examen-clinique", examenCliniqueRoute);
app.use("/api/signesFonctionnels", signeFonctionRoute);
app.use("/api/signesCliniques", signeCliniqueRoute);
app.use("/api/observations", observationRoute);
app.use("/api/audit", auditRoutes);
app.use("/api/rendezvous", rendezvousRouter);
app.use("/api/stock", stockRoute);
app.use("/api", conclusionRoutes);
app.use("/api/mobile/auth", mobileAuthRoutes);
app.use("/api/mobile/patient", mobilePatientRoutes);
app.use("/api/mobile/rendezvous", mobileRendezvousRoutes);
app.use("/api/bilan-examens", bilanExamenRoute);
app.use("/api/resultats-biologiques", resultatBiologiqueRoute);
app.use("/api/suivi-biologique", suiviBiologiqueRoute);
app.use("/api/suivi-notifications", suiviNotificationRoute);
app.use("/api/permissions", permissionRoutes);
app.use("/api/emergency-contacts", emergencyContactRoutes);
app.use("/api/bi", biRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Server error" });

});


const startServer = async () => {
  try {
    await db.connect();
    console.log("PostgreSQL connected, server starting...");

    const PORT = process.env.PORT;
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to PostgreSQL:", err);
    process.exit(1);
  }
};

// web Scheduler
startBiRefreshJob(); // utilisé pour faire refresh les MVs de la BI chaque nuit à 02h00
startStatutsJob();// utilisé pour faire refresh les statuts des patients chaque nuit à 03h00
startNotificationsJob();          // 03h30 — Création notifications nuit
startCleanupNotificationsJob();   // 04h00 — Cleanup notifs > 7 jours

startServer();

