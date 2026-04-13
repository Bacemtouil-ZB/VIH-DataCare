// utiliser pour faire refresh les MVs de la BI chaque nuit à 02h00

import cron from "node-cron";
import { refreshNouveauxMaladesMVs } from "../services/biService.js";

export const startBiRefreshJob = () => {
  // chaque nuit à 02h00
  cron.schedule("0 2 * * *", async () => {
    console.log("[BI Job] Refresh MVs démarré —", new Date().toISOString());
    try {
      await refreshNouveauxMaladesMVs();
      console.log("[BI Job] Refresh terminé avec succès");
    } catch (err) {
      console.error("[BI Job] Erreur refresh :", err.message);
    }
  });

  console.log("[BI Job] Job planifié — chaque nuit à 02h00");
};