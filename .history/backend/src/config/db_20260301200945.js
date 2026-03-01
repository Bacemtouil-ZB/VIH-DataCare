<<<<<<< HEAD
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

=======
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cherche .env dans plusieurs emplacements possibles
const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "..", ".env"),
  path.resolve(__dirname, "..", "..", ".env"),
];

const envPath = candidates.find((p) => fs.existsSync(p));
if (!envPath) {
  throw new Error(
    `Fichier .env introuvable. Cherché:\n- ${candidates.join("\n- ")}`,
  );
}

dotenv.config({ path: envPath });
console.log("✅ .env chargé depuis:", envPath);

// Vérifie les variables indispensables
const must = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_NAME"];
for (const k of must) {
  const v = process.env[k];
  if (!v || v.trim() === "") {
    throw new Error(`❌ Variable ${k} manquante dans ${envPath}`);
  }
}

// Port en number
const port = Number(process.env.DB_PORT || 5432);
if (Number.isNaN(port)) {
  throw new Error("❌ DB_PORT invalide (doit être un nombre).");
}

// Crée le Pool
>>>>>>> feature/resetPassword
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
<<<<<<< HEAD
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("PostgreSQL connecté"))
  .catch((err) => console.error("Erreur de connexion :", err));
=======
  password: String(process.env.DB_PASSWORD), // ✅ string garanti
  port, // ✅ number
});

// Test connexion
pool
  .connect()
  .then((client) => {
    console.log("PostgreSQL connecté ✅");
    client.release();
  })
  .catch((err) => console.error("Erreur de connexion ❌ :", err));
>>>>>>> feature/resetPassword

export default pool;
