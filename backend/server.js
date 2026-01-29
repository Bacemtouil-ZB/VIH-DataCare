import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js"; // pour connecter PostgreSQL

dotenv.config();
const app = express();

app.use(express.json());

// Routes
// //exemple
// app.use("/api/patients", patientRoutes);

// Route racine test
app.get("/", (req, res) => {
  res.send("Backend MediVIH fonctionne !");
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
