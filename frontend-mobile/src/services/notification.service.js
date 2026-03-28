import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermission = async () => {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Rappels',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
};

export const scheduleReminderNotification = async (reminder) => {
  const [hours, minutes] = reminder.time.split(':').map(Number);

  let trigger;

  if (reminder.repeat === 'daily') {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    };
  } else if (reminder.repeat === 'weekly') {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: new Date().getDay() + 1,
      hour: hours,
      minute: minutes,
    };
  } else {
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    if (date <= new Date()) {
      date.setDate(date.getDate() + 1);
    }
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: date,
    };
  }

 const notificationId = await Notifications.scheduleNotificationAsync({
  content: {
    title: reminder.discreteMode
      ? '🔔 Action requise'
      : '📅 Rappel',

    body: reminder.discreteMode
      ? 'Veuillez vérifier votre application'
      : reminder.title,

    sound: 'default',
    data: { reminderId: reminder.id },
  },
  trigger,
});

  return notificationId;
};

export const cancelReminderNotification = async (notificationId) => {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};