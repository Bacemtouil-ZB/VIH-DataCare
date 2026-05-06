import 'react-native-reanimated'; 

import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/appNavigator";
import useReminderStore from "./src/store/reminderStore";
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/ToastConfig';
import { I18nProvider } from "./src/i18n/i18nContext";

export default function App() {
  const loadReminders = useReminderStore((state) => state.loadReminders);

  useEffect(() => {
    loadReminders();
  }, []);

  return (
    <I18nProvider>
      <AppNavigator />
      <Toast config={toastConfig} />
    </I18nProvider>
  );
}
