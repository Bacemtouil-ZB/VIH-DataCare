import pool from "../config/db.js";
import {
  getNotifications,
  createNotification,
  notificationExiste,
  getDateEstimeeByNumero as getDateEstimeeModel,
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
      case "alerte":
        const labels = {
          decede:      "marqué décédé",
          decede_sida: "marqué décédé (SIDA)",
          transfere:   "marqué transféré",
        };
        message = `${patientLabel} · ${labels[row.patient_status] ?? "statut administratif"}`;
        rdv_url = `/medecin/patient/${row.patient_numero}/workspace/profil`;
        break;
      case "prescription_non_validee":
        message = `${patientLabel} · prescription expirée`;
        rdv_url = `/medecin/patient/${row.patient_numero}/workspace/profil`;
        break;
      case "rdv_manque":
        message = `${patientLabel} · RDV manqué`;
        rdv_url = `/medecin/patient/${row.patient_numero}/workspace/rendez-vous`;
        break;
      case "rdv_proche":
        message = `${patientLabel} · RDV dans ${row.rdv_date ? new Date(row.rdv_date).toLocaleDateString("fr-FR") : ""}`;
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
      created_at:      row.created_at,
      date_prochaine_prise: row.date_prochaine_prise,
      date_ecart:      row.date_ecart,
    };
  });
};

// ── CREATE notifications nuit (cron 03h30) ────────────────────
export const createNotificationsNuit = async () => {
  const created = [];

  // 1. en_retard
  const { rows: enRetard } = await pool.query(`
    SELECT st.id AS suivi_id, st.patient_id
    FROM suivi_therapeutique st
    INNER JOIN patients p ON p.id = st.patient_id
    WHERE st.statut_patient = 'en_retard'
      AND st.date_ecart = 2
      AND p.status NOT IN ('decede', 'decede_sida', 'transfere' , 'standard_inactif', 'migrant_inactif')
  `);
  for (const row of enRetard) {
    const existe = await notificationExiste({ patient_id: row.patient_id, type: 'en_retard', suivi_id: row.suivi_id });
    if (!existe) created.push(await createNotification({ patient_id: row.patient_id, type: 'en_retard', suivi_id: row.suivi_id }));
  }

  // 2. perdu_de_vue
  const { rows: perdus } = await pool.query(`
    SELECT DISTINCT ON (st.patient_id)
      st.id AS suivi_id, st.patient_id
    FROM suivi_therapeutique st
    INNER JOIN patients p ON p.id = st.patient_id
    WHERE st.statut_patient = 'perdu_de_vue'
      AND p.status NOT IN ('decede', 'decede_sida', 'transfere' , 'standard_inactif', 'migrant_inactif')
    ORDER BY st.patient_id, st.created_at DESC
  `);
  for (const row of perdus) {
    const existe = await notificationExiste({ patient_id: row.patient_id, type: 'perdu_de_vue', suivi_id: row.suivi_id });
    if (!existe) created.push(await createNotification({ patient_id: row.patient_id, type: 'perdu_de_vue', suivi_id: row.suivi_id }));
  }

  // 3. prescription_non_validee
  const { rows: nonValidees } = await pool.query(`
    SELECT pm.id AS prescription_id, pm.patient_id
    FROM prescription_medicale pm
    INNER JOIN patients p ON p.id = pm.patient_id
    WHERE pm.statut = 'non_validee'
      AND p.status NOT IN ('decede', 'decede_sida', 'transfere' , 'standard_inactif', 'migrant_inactif')
  `);
  for (const row of nonValidees) {
    const existe = await notificationExiste({ patient_id: row.patient_id, type: 'prescription_non_validee', prescription_id: row.prescription_id });
    if (!existe) created.push(await createNotification({ patient_id: row.patient_id, type: 'prescription_non_validee', prescription_id: row.prescription_id }));
  }

  // 4. rdv_manque
  const { rows: rdvManques } = await pool.query(`
    SELECT rv.id AS rdv_id, rv.patient_id
    FROM rendezvous rv
    INNER JOIN patients p ON p.id = rv.patient_id
    WHERE rv.date < CURRENT_DATE
      AND rv.statut NOT IN ('effectue', 'annule')
      AND p.status NOT IN ('decede', 'decede_sida', 'transfere' , 'standard_inactif', 'migrant_inactif')
  `);
  for (const row of rdvManques) {
    const existe = await notificationExiste({ patient_id: row.patient_id, type: 'rdv_manque', rdv_id: row.rdv_id });
    if (!existe) created.push(await createNotification({ patient_id: row.patient_id, type: 'rdv_manque', rdv_id: row.rdv_id }));
  }

  // 5. rdv_proche
  const { rows: rdvProches } = await pool.query(`
    SELECT rv.id AS rdv_id, rv.patient_id
    FROM rendezvous rv
    INNER JOIN patients p ON p.id = rv.patient_id
    WHERE rv.date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      AND rv.statut NOT IN ('effectue', 'annule')
      AND p.status NOT IN ('decede', 'decede_sida', 'transfere' , 'standard_inactif', 'migrant_inactif')
  `);
  for (const row of rdvProches) {
    const existe = await notificationExiste({ patient_id: row.patient_id, type: 'rdv_proche', rdv_id: row.rdv_id });
    if (!existe) created.push(await createNotification({ patient_id: row.patient_id, type: 'rdv_proche', rdv_id: row.rdv_id }));
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
  // alerte → contradiction decede/transfere
  if (estAlerte) {
    const existe = await notificationExiste({ patient_id, type: 'alerte', suivi_id });
    if (!existe) await createNotification({ patient_id, type: 'alerte', suivi_id, prescription_id });
    return;
  }

  // delivrance → toujours créée
  const existe = await notificationExiste({ patient_id, type: 'delivrance', suivi_id });
  if (!existe) await createNotification({ patient_id, type: 'delivrance', suivi_id, prescription_id });
};



// ── Date estimée par numéro ── ← ajouter cette fonction
export const getDateEstimeeByNumero = async (numero) => {
  const row = await getDateEstimeeModel(numero);
  if (!row) return null;

  return {
    patient_numero:       row.patient_numero,
    patient_name:         row.patient_name,
    patient_surname:      row.patient_surname,
    date_prochaine_prise: row.date_prochaine_prise,
  };
};