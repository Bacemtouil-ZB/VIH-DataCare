import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import useReminderStore from '../../../store/reminderStore';
import { requestNotificationPermission } from '../../../services/notification.service';

const useReminders = () => {
  const navigation = useNavigation();
  const {
    reminders,
    isLoading,
    loadReminders,
    addReminder,
    toggleReminder,
    deleteReminder,
  } = useReminderStore();

  useEffect(() => {
    requestNotificationPermission();
    loadReminders();
  }, []);

  const todayReminders = reminders.filter((r) => r.isActive);

  const handleAdd = () => {
    navigation.navigate('CreateReminder');
  };

  const handleToggle = async (id) => {
    await toggleReminder(id);
  };

  const handleDelete = async (id) => {
    await deleteReminder(id);
  };

  return {
    reminders,
    todayReminders,
    isLoading,
    handleAdd,
    handleToggle,
    handleDelete,
  };
};

export default useReminders;