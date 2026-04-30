import pool from "../config/db.js";

export const requireFemme = async (req, res, next) => {
  const { patientId } = req.params; // reçoit "0005-2026"
  
  try {
    const result = await pool.query(
      "SELECT gender FROM patients WHERE numero = $1", // ← WHERE numero au lieu de WHERE id
      [patientId]
    );
    
    const patient = result.rows[0];
    
    if (!patient) {
      return res.status(404).json({ message: "Patient introuvable" });
    }
    
    if (patient.gender !== "femme") {
      return res.status(403).json({ 
        message: "Accès refusé : antécédents gynécologiques réservés aux patientes" 
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};