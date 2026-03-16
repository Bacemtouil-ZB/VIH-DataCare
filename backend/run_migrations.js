import fs from 'fs/promises';
import path from 'path';
import db from './src/config/db.js';

const runMigrations = async () => {
  // On affiche le répertoire de travail actuel pour déboguer
  const currentDir = process.cwd();
const migrationsDir = path.resolve(process.cwd(), 'src', 'migrations');
  
  console.log(`🔍 Recherche des migrations dans : ${migrationsDir}`);

  try {
    // Vérifier si le dossier existe
    await fs.access(migrationsDir);
    
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();

    if (sqlFiles.length === 0) {
      console.log('⚠️ Aucun fichier .sql trouvé dans le dossier migrations.');
      return;
    }

    for (const file of sqlFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');
      
      console.log(`⏳ Migration en cours : ${file}...`);
      await db.query(sql);
      console.log(`✅ Migration ${file} réussie.`);
    }
    console.log('🏁 Toutes les migrations sont terminées.');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ ERREUR : Le dossier '${migrationsDir}' est introuvable !`);
      console.log(`💡 Vérifiez que vous avez bien créé le dossier 'migrations' à la racine de votre projet backend.`);
    } else {
      console.error('❌ Erreur lors des migrations :', error.message);
    }
  }
};

export default runMigrations;
