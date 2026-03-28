import pool from '../../config/db.js';
import { sendPushNotification } from './mobilePushService.js';

const getRendezvousInHours = async (hours) => {
  const query = `
    SELECT 
      rdv.id,
      rdv.date,
      rdv.heure,
      rdv.type,
      rdv.statut,
      u.expo_push_token,
      p.name,
      p.surname
    FROM rendezvous rdv
    JOIN patients p ON rdv.patient_id = p.id
    JOIN users u ON u.id = p.user_id
    WHERE 
      u.expo_push_token IS NOT NULL
      AND rdv.statut NOT IN ('annule', 'termine', 'Annule', 'Termine')
      AND (rdv.date + rdv.heure) BETWEEN 
        NOW() + ($1 || ' hours')::interval - INTERVAL '5 minutes'
        AND NOW() + ($1 || ' hours')::interval + INTERVAL '5 minutes'
  `;
  const result = await pool.query(query, [hours.toString()]);
  return result.rows;
};

export const runRendezvousNotificationScheduler = async () => {
  

  try {
    // 24h before
    const rdv24h = await getRendezvousInHours(24);
    for (const rdv of rdv24h) {
      await sendPushNotification(
        rdv.expo_push_token,
        'Rappel rendez-vous',
        `Vous avez un rendez-vous demain à ${rdv.heure.substring(0, 5)}`,
        { rendezvousId: rdv.id }
      );
      
    }

    // 1h before
    const rdv1h = await getRendezvousInHours(1);
    for (const rdv of rdv1h) {
      await sendPushNotification(
        rdv.expo_push_token,
        'Rendez-vous dans 1 heure',
        `N'oubliez pas votre rendez-vous à ${rdv.heure.substring(0, 5)}`,
        { rendezvousId: rdv.id }
      );
    
    }
  } catch (error) {
    console.error('Scheduler error:', error);
  }
};