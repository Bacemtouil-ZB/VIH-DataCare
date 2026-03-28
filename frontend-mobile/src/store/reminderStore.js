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

  // Load reminders from AsyncStorage on app start
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

  // Add new reminder
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

    // Schedule notification
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

  // Toggle active/inactive
  toggleReminder: async (id) => {
    const reminders = get().reminders;
    const updated = await Promise.all(
      reminders.map(async (r) => {
        if (r.id !== id) return r;
        if (r.isActive) {
          // Deactivate — cancel notification
          await cancelReminderNotification(r.notificationId);
          return { ...r, isActive: false, notificationId: null };
        } else {
          // Activate — reschedule notification
          const notificationId = await scheduleReminderNotification(r);
          return { ...r, isActive: true, notificationId };
        }
      })
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ reminders: updated });
  },

  // Delete reminder
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