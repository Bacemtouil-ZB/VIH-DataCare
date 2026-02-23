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
