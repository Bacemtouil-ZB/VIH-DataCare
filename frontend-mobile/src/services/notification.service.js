import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import translations, { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "../i18n/translations";

const LANGUAGE_STORAGE_KEY = "app.language";

const getTranslationValue = (language, key) => {
  const source = translations[language];
  if (!source) return undefined;

  return key.split(".").reduce((value, segment) => {
    if (value && Object.prototype.hasOwnProperty.call(value, segment)) {
      return value[segment];
    }
    return undefined;
  }, source);
};

const translate = (language, key) => {
  const value = getTranslationValue(language, key);
  if (typeof value === "string") return value;

  const fallback = getTranslationValue(DEFAULT_LANGUAGE, key);
  return typeof fallback === "string" ? fallback : key;
};

const getPreferredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    // Keep default language if storage read fails.
  }

  return DEFAULT_LANGUAGE;
};

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

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  if (Platform.OS === "android") {
    const language = await getPreferredLanguage();

    await Notifications.setNotificationChannelAsync("reminders", {
      name: translate(language, "notifications.channelName"),
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      enableVibrate: true,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
};

export const scheduleReminderNotification = async (reminder) => {
  const [hours, minutes] = reminder.time.split(":").map(Number);
  const language = await getPreferredLanguage();
  let trigger;

  if (reminder.repeat === "daily") {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hours,
      minute: minutes,
    };
  } else if (reminder.repeat === "weekly") {
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
      date,
    };
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: reminder.discreteMode
        ? translate(language, "notifications.actionRequiredTitle")
        : translate(language, "notifications.reminderTitle"),
      body: reminder.discreteMode
        ? translate(language, "notifications.actionRequiredBody")
        : reminder.title,
      sound: "default",
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
