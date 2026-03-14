// src/routes/index.js
import { Router } from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import patientRoutes from "./patientRoutes.js";
import ordonnanceRoute from "./ordonnanceRoute.js";
import patientOrdRoute from "./PatientsOrdRoute.js";
import addressRoutes from "./addressRoutes.js";
import vihRoute from "./vihRoute.js";
import socialRoutes from "./socialRoute.js";
import antecedentRoutes from "./antecedentRoutes.js";
import examenCliniqueRoute from "./examenClinique/examenCliniqueRoute.js";
import signeClinique from "./examenClinique/signeCliniqueRoute.js";
import signeFonctionRoute from "./examenClinique/signeFonctionRoute.js";
import habitude from "./examenClinique/habitudeDeVieRoute.js";
import observations from "./examenClinique/observationRoute.js";
import auditRoutes from "./auditRoutes.js";
import rendezvousRouter from "./rendezVousRoute.js";
import stockRoute from "./stockRoute.js";
import conclusionRoutes from "./doctorConclusionsRoutes.js";
import prescriptionMedical from "./prescriptionMedicalRoute.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/patients", patientRoutes);
router.use("/ordonnances", ordonnanceRoute);
router.use("/patients/ordonnances", patientOrdRoute);
router.use("/addresses", addressRoutes);
router.use("/vih", vihRoute);
router.use("/social", socialRoutes);
router.use("/antecedents", antecedentRoutes);
router.use("/examen-clinique", examenCliniqueRoute);
router.use("/signesCliniques", signeClinique);
router.use("/signesFonctionnels", signeFonctionRoute);
router.use("/habitudes", habitude);
router.use("/observations", observations);
router.use("/audit", auditRoutes);
router.use("/rendezvous", rendezvousRouter);
router.use("/stock", stockRoute);
router.use("/conclusions", conclusionRoutes);
router.use("/prescription-medicale", prescriptionMedical);

export default router;
