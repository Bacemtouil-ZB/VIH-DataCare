import {
  getNotifications,
  createNotification,
  notificationExiste,
  getDateEstimeeByNumero as getDateEstimee,
  getPatientsEnRetard,
  getPatientsPerdusDeVue,
  getPrescriptionsNonValidees,
  getRdvManques,
  getRdvProches,
} from "../models/suiviNotificationModel.js";

// ── GET — toutes notifications enrichies → frontend ───────────
export const buildNotifications = async () => {
  const rows = await getNotifications();

  return rows.map((row) => {
    const patientLabel = `${row.patient_surname} ${row.patient_name} — N° ${row.patient_numero}`;

    let message = patientLabel;
    let rdv_url = null;

    switch (row.type) {
      case "delivrance":
        message = `${patientLabel} · traitement délivré`;
        rdv_url = `/medecin/patient/${row.patient_numero}/workspace/rendez-vous`;
        break;
      case "en_retard":
        message = `${patientLabel} · ${row.date_ecart}j de retard`;
        break;
      case "perdu_de_vue":
        message = `${patientLabel} · absent depuis ${row.date_ecart}j`;
        break;
      case "recupere":
        message = `${patientLabel} · de retour après absence`;
        break;
      case "alerte": {
        const labels = {
          decede:      "marqué décédé",
          decede_sida: "marqué décédé (SIDA)",
          transfere:   "marqué transféré",
        };
        message = `${patientLabel} · ${labels[row.patient_status] ?? "statut administratif"}`;
        rdv_url = `/medecin/patient/${row.patient_numero}/workspace/profil`;
        break;
      }
      case "prescription_non_validee":
        message = `${patientLabel} · prescription expirée`;
        rdv_url = `/medecin/patient/${row.patient_numero}/workspace/profil`;
        break;
      case "rdv_manque":
        message = `${patientLabel} · RDV manqué`;
        rdv_url = `/medecin/patient/${row.patient_numero}/workspace/rendez-vous`;
        break;
      case "rdv_proche":
        message = `${patientLabel} · RDV dans ${
          row.rdv_date ? new Date(row.rdv_date).toLocaleDateString("fr-FR") : ""
        }`;
        rdv_url = `/medecin/patient/${row.patient_numero}/workspace/rendez-vous`;
        break;
    }

    return {
      id:              `notif-${row.notif_id}`,
      notif_id:        row.notif_id,
      type:            row.type,
      patient_id:      row.patient_id,
      patient_numero:  row.patient_numero,
      patient_name:    row.patient_name,
      patient_surname: row.patient_surname,
      message,
      rdv_url,
      created_at:           row.created_at,
      date_prochaine_prise: row.date_prochaine_prise,
      date_ecart:           row.date_ecart,
    };
  });
};

// ── Helper : créer une notification si elle n'existe pas déjà ─
const createIfNotExists = async (params) => {
  const existe = await notificationExiste(params);
  if (!existe) return await createNotification(params);
  return null;
};

// ── CREATE notifications nuit (cron 03h30) ────────────────────
export const createNotificationsNuit = async () => {
  const created = [];

  // 1. en_retard
  const enRetard = await getPatientsEnRetard();
  for (const row of enRetard) {
    const notif = await createIfNotExists({ patient_id: row.patient_id, type: "en_retard", suivi_id: row.suivi_id });
    if (notif) created.push(notif);
  }

  // 2. perdu_de_vue
  const perdus = await getPatientsPerdusDeVue();
  for (const row of perdus) {
    const notif = await createIfNotExists({ patient_id: row.patient_id, type: "perdu_de_vue", suivi_id: row.suivi_id });
    if (notif) created.push(notif);
  }

  // 3. prescription_non_validee
  const nonValidees = await getPrescriptionsNonValidees();
  for (const row of nonValidees) {
    const notif = await createIfNotExists({ patient_id: row.patient_id, type: "prescription_non_validee", prescription_id: row.prescription_id });
    if (notif) created.push(notif);
  }

  // 4. rdv_manque
  const rdvManques = await getRdvManques();
  for (const row of rdvManques) {
    const notif = await createIfNotExists({ patient_id: row.patient_id, type: "rdv_manque", rdv_id: row.rdv_id });
    if (notif) created.push(notif);
  }

  // 5. rdv_proche
  const rdvProches = await getRdvProches();
  for (const row of rdvProches) {
    const notif = await createIfNotExists({ patient_id: row.patient_id, type: "rdv_proche", rdv_id: row.rdv_id });
    if (notif) created.push(notif);
  }

  return created;
};

// ── CREATE notification après délivrance ──────────────────────
// Appelée depuis prescriptionWorkflowModel.js
export const createNotificationDelivrance = async ({
  patient_id,
  suivi_id,
  prescription_id,
  estAlerte,
}) => {
  if (estAlerte) {
    await createIfNotExists({ patient_id, type: "alerte", suivi_id, prescription_id });
    return;
  }
  await createIfNotExists({ patient_id, type: "delivrance", suivi_id, prescription_id });
};

// ── GET date estimée par numéro patient ───────────────────────
export const getDateEstimeeByNumero = async (numero) => {
  const row = await getDateEstimee(numero);
  if (!row) return null;

  return {
    patient_numero:       row.patient_numero,
    patient_name:         row.patient_name,
    patient_surname:      row.patient_surname,
    date_prochaine_prise: row.date_prochaine_prise,
  };
};