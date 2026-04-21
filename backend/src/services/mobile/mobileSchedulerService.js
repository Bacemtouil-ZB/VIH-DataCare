import { getRendezvousAvant24h } from '../../models/mobile/mobileRendezvousModel.js';
import { sendPushNotification } from './mobilePushService.js';

export const runRendezvousNotificationScheduler = async () => {
  try {
    const rdvDemain = await getRendezvousAvant24h();

    console.log(`[Scheduler] ${rdvDemain.length} rappel(s) à envoyer`);

    for (const rdv of rdvDemain) {
      await sendPushNotification(
        rdv.expo_push_token,
        'Rappel rendez-vous',
        `Bonjour ${rdv.name}, vous avez un rendez-vous demain à ${rdv.heure.substring(0, 5)}`,
        { rendezvousId: rdv.id }
      );
    }

    console.log(`[Scheduler] Terminé — ${rdvDemain.length} notification(s) envoyées`);
  } catch (error) {
    console.error('[Scheduler] Erreur :', error.message);
  }
};