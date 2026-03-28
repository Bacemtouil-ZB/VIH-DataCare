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
import habitudeRoute from "./src/routes/examenClinique/habitudeDeVieRoute.js";
import observationRoute from "./src/routes/examenClinique/observationRoute.js";
import auditRoutes from "./src/routes/auditRoutes.js";
import rendezvousRouter from "./src/routes/rendezVousRoute.js";
import stockRoute from "./src/routes/stockRoute.js";
import conclusionRoutes from "./src/routes/doctorConclusionsRoutes.js";
import prescriptionMedicalRoute from "./src/routes/prescriptionMedicalRoute.js";
import mobileAuthRoutes from "./src/routes/mobile/mobileAuthRoutes.js";
import mobilePatientRoutes from "./src/routes/mobile/mobilePatientRoutes.js";
import mobileRendezvousRoutes from "./src/routes/mobile/mobileRendezvousRoutes.js";
import suiviTherapeutiqueRoute from "./src/routes/suiviTherapeutiqueRoute.js";
// Scheduler
import { startScheduler } from './src/services/mobile/mobileScheduler.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
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
app.use("/api/habitudes", habitudeRoute);
app.use("/api/observations", observationRoute);
app.use("/api/audit", auditRoutes);
app.use("/api/rendezvous", rendezvousRouter);
app.use("/api/stock", stockRoute);
app.use("/api", conclusionRoutes);
app.use("/api/prescription-medicale", prescriptionMedicalRoute);
app.use("/api/mobile/auth", mobileAuthRoutes);
app.use("/api/mobile/patient", mobilePatientRoutes);
app.use("/api/mobile/rendezvous", mobileRendezvousRoutes);
app.use("/api/suivi-therapeutique", suiviTherapeutiqueRoute);



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

    const PORT = process.env.PORT || 3000;
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to PostgreSQL:", err);
    process.exit(1);
  }
};

startServer();

