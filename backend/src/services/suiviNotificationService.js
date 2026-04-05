// suiviNotificationService.js

import { getNotificationsRdv, getDateEstimeeByNumero as getDateEstimeeModel } from "../models/suiviNotificationModel.js";

// ── Notifications ──
export const buildNotifications = async () => {
  const rows = await getNotificationsRdv();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const in7days = new Date(today);
  in7days.setDate(today.getDate() + 7);

  return rows.map((row) => {
    const rdvDate = new Date(row.date_prochaine_prise);
    rdvDate.setHours(0, 0, 0, 0);

    let type;
    if (rdvDate < today)        type = "missed";
    else if (rdvDate <= in7days) type = "soon";
    else                         type = "pharmacie";

    return {
      id:                   `notif-${row.suivi_id}`,
      type,
      suivi_id:             row.suivi_id,
      patient_id:           row.patient_id,
      patient_numero:       row.patient_numero,
      patient_name:         row.patient_name,
      patient_surname:      row.patient_surname,
      date_prochaine_prise: row.date_prochaine_prise,
      rdv_url: `/medecin/patient/${row.patient_numero}/workspace/rendez-vous`,
    };
  });
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