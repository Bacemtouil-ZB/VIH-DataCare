import cron from 'node-cron';
import { runRendezvousNotificationScheduler } from './mobileSchedulerService.js';

export const startScheduler = () => {
  cron.schedule('*/5 * * * *', async () => {
    await runRendezvousNotificationScheduler();
  });
  console.log('✅ Notification scheduler started');
};