import cron from "node-cron";
import { refreshAllMaterializedViews }  from "../services/biService.js";
import { recalculerTousLesStatuts }   from "../models/patientModel.js";
import { recalculerEcartEtStatuts }   from "../models/prescriptionWorkflowModel.js";
import { cleanupNotifications }       from "../models/suiviNotificationModel.js";
import { createNotificationsNuit }    from "../services/suiviNotificationService.js";

// ── 02h00 — Refresh BI ────────────────────────────────────────
export const startBiRefreshJob = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("[BI Job] Refresh MVs démarré —", new Date().toISOString());
    try {
      await refreshAllMaterializedViews();
      console.log("[BI Job] Refresh terminé avec succès");
    } catch (err) {
      console.error("[BI Job] Erreur refresh :", err.message);
    }
  });
  console.log("[BI Job] Planifié — 02h00");
};

// ── 03h00 — Recalcul statuts patients ────────────────────────
export const startStatutsJob = () => {
  //cron.schedule("0 3 * * *", async () => {
   cron.schedule("*/1 * * * *", async () => {
    console.log("[Statuts Job] Recalcul démarré —", new Date().toISOString());
    try {
      const sansSuivi = await recalculerTousLesStatuts();
      console.log(`[Statuts Job] Sans suivi : ${sansSuivi.length} mis à jour`);

      const avecSuivi = await recalculerEcartEtStatuts();
      console.log(`[Statuts Job] Avec suivi : ${avecSuivi.length} mis à jour`);
    } catch (err) {
      console.error("[Statuts Job] Erreur :", err.message);
    }
  });
  console.log("[Statuts Job] Planifié — 03h00");
};

// ── 03h30 — Création notifications nuit ──────────────────────
// Après recalcul statuts (03h00) pour avoir les données à jour
export const startNotificationsJob = () => {
  cron.schedule("30 3 * * *", async () => {
    console.log("[Notif Job] Création notifications démarré —", new Date().toISOString());
    try {
      const created = await createNotificationsNuit();
      console.log(`[Notif Job] ${created.length} notification(s) créées`);
    } catch (err) {
      console.error("[Notif Job] Erreur :", err.message);
    }
  });
  console.log("[Notif Job] Planifié — 03h30");
};

// ── 04h00 — Cleanup notifications > 7 jours ──────────────────
export const startCleanupNotificationsJob = () => {
  cron.schedule("0 4 * * *", async () => {
    console.log("[Cleanup Job] Démarré —", new Date().toISOString());
    try {
      const deleted = await cleanupNotifications();
      console.log(`[Cleanup Job] ${deleted.length} notification(s) supprimées`);
    } catch (err) {
      console.error("[Cleanup Job] Erreur :", err.message);
    }
  });
  console.log("[Cleanup Job] Planifié — 04h00");
};