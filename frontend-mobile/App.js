import 'react-native-reanimated';

import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/appNavigator";
import useReminderStore from "./src/store/reminderStore";
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/ToastConfig';

export default function App() {
  const loadReminders = useReminderStore((state) => state.loadReminders);

  useEffect(() => {
    loadReminders();
  }, []);

  return (
    <>
      <AppNavigator />
      <Toast config={toastConfig} />
    </>
  );
}