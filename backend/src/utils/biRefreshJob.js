// utiliser pour faire refresh les MVs de la BI chaque nuit à 02h00

import cron from "node-cron";
import { refreshNouveauxMaladesMVs } from "../services/biService.js";
import { recalculerTousLesStatuts } from "../models/patientModel.js";
import { recalculerEcartEtStatuts } from "../models/prescriptionWorkflowModel.js";

///best practice : séparer les jobs de refresh BI et de recalcul des statuts dans diffrents temps pour éviter de faire :
//surcharge serveur
//conflits DB
//ralentissement

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

export const startStatutsJob = () => {
  cron.schedule("0 3 * * *", async () => {
    console.log("[Statuts Job] Recalcul démarré —", new Date().toISOString());
    try {
      // 1. Patients sans suivi → perdu_de_vue si ≥ 180j
      const sansSuivi = await recalculerTousLesStatuts();
      console.log(`[Statuts Job] Sans suivi : ${sansSuivi.length} mis à jour`);

      // 2. Patients avec suivi → écart + statut
      const avecSuivi = await recalculerEcartEtStatuts();
      console.log(`[Statuts Job] Avec suivi : ${avecSuivi.length} mis à jour`);

    } catch (err) {
      console.error("[Statuts Job] Erreur :", err.message);
    }
  });
  console.log("[Statuts Job] Planifié — 03h00");
};