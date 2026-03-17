import fs from 'fs/promises';
import path from 'path';
import db from './src/config/db.js';

const runMigrations = async () => {
  const migrationsDir = path.resolve(process.cwd(), 'src', 'migrations');
  
  console.log(`🔍 Recherche des migrations dans : ${migrationsDir}`);

  try {
    // Créer la table de tracking si elle n'existe pas
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table migrations créée/vérifiée');

    // Vérifier si le dossier existe
    await fs.access(migrationsDir);
    
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();

    if (sqlFiles.length === 0) {
      console.log('⚠️ Aucun fichier .sql trouvé');
      return;
    }

    console.log(`📁 ${sqlFiles.length} fichiers de migration trouvés`);

    for (const file of sqlFiles) {
      // Vérifier si déjà exécutée
      const { rows } = await db.query(
        'SELECT filename FROM migrations WHERE filename = $1',
        [file]
      );

      if (rows.length > 0) {
        console.log(`⏭️  Déjà exécutée: ${file}`);
        continue;
      }

      // Lire et exécuter
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');
      
      console.log(`🔄 Exécution: ${file}`);
      
      try {
        await db.query(sql);
        
        // Marquer comme exécutée
        await db.query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [file]
        );
        
        console.log(`✅ Réussie: ${file}`);
      } catch (err) {
        console.error(`❌ Erreur dans ${file}:`, err.message);
        throw err;
      }
    }
    
    console.log('🏁 Toutes les migrations terminées!');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Dossier introuvable: ${migrationsDir}`);
    } else {
      console.error('❌ Erreur migrations:', error.message);
    }
    throw error;
  }
};

export default runMigrations;