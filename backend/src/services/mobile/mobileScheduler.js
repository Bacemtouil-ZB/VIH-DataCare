import cron from 'node-cron';
import { runRendezvousNotificationScheduler } from './mobileSchedulerService.js';

export const startScheduler = () => {
  cron.schedule('0 */5 * * *', async () => { // Every 5 hours
    await runRendezvousNotificationScheduler();
  });
  console.log('✅ Notification scheduler started');
};