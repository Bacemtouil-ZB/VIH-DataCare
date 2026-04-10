import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  scheduleReminderNotification,
  cancelReminderNotification,
} from '../services/notification.service';

const STORAGE_KEY = 'reminders';

const useReminderStore = create((set, get) => ({
  reminders: [],
  isLoading: false,

  loadReminders: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const reminders = stored ? JSON.parse(stored) : [];
      set({ reminders });
    } catch (error) {
      console.error('Failed to load reminders:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addReminder: async (reminderData) => {
    const newReminder = {
      id: Date.now().toString(),
      title: reminderData.title,
      time: reminderData.time,
      repeat: reminderData.repeat,
      type: reminderData.type,
      discreteMode: reminderData.discreteMode ?? true,
      isActive: true,
      createdAt: new Date().toISOString(),
      notificationId: null,
    };

    try {
      const notificationId = await scheduleReminderNotification(newReminder);
      newReminder.notificationId = notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }

    const updated = [newReminder, ...get().reminders];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ reminders: updated });
    return newReminder;
  },

  updateReminder: async (id, reminderData) => {
    const reminders = get().reminders;
    const existing = reminders.find((r) => r.id === id);
    if (!existing) return;

    if (existing.notificationId) {
      await cancelReminderNotification(existing.notificationId);
    }

    const updated = reminders.map((r) => {
      if (r.id !== id) return r;
      return {
        ...r,
        title: reminderData.title,
        time: reminderData.time,
        repeat: reminderData.repeat,
        type: reminderData.type,
        discreteMode: reminderData.discreteMode ?? r.discreteMode,
        notificationId: null,
      };
    });

    const updatedReminder = updated.find((r) => r.id === id);
    try {
      const notificationId = await scheduleReminderNotification(updatedReminder);
      updatedReminder.notificationId = notificationId;
    } catch (error) {
      console.error('Failed to reschedule notification:', error);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ reminders: updated });
  },

  toggleReminder: async (id) => {
    const reminders = get().reminders;
    const updated = reminders.map((r) => {
      if (r.id !== id) return r;
      return { ...r, isActive: !r.isActive };
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ reminders: updated });
  },

  deleteReminder: async (id) => {
    const reminders = get().reminders;
    const reminder = reminders.find((r) => r.id === id);
    if (reminder?.notificationId) {
      await cancelReminderNotification(reminder.notificationId);
    }
    const updated = reminders.filter((r) => r.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ reminders: updated });
  },

}));

export default useReminderStore;