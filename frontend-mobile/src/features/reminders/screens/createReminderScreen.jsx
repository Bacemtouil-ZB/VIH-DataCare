import React, { useMemo, useState } from "react";
import Toast from "react-native-toast-message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import useReminderStore from "../../../store/reminderStore";
import styles from "../styles/reminders.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const CreateReminderScreen = () => {
  const navigation = useNavigation();
  const { addReminder } = useReminderStore();
  const { t, isRTL } = useI18n();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("medicament");
  const [repeat, setRepeat] = useState("daily");
  const [discreteMode, setDiscreteMode] = useState(true);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const types = useMemo(
    () => [
      { key: "medicament", label: t("reminders.typeMedicament"), icon: "pill" },
      { key: "rendezvous", label: t("reminders.typeRendezvous"), icon: "calendar-heart" },
      { key: "analyse", label: t("reminders.typeAnalyse"), icon: "test-tube" },
      { key: "autre", label: t("reminders.typeOther"), icon: "bell-outline" },
    ],
    [t]
  );

  const repeats = useMemo(
    () => [
      { key: "daily", label: t("reminders.repeatDaily") },
      { key: "weekly", label: t("reminders.repeatWeekly") },
      { key: "once", label: t("reminders.repeatOnce") },
    ],
    [t]
  );

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Toast.show({
        type: "error",
        text1: t("reminders.toastErrorTitle"),
        text2: t("reminders.toastTitleRequired"),
      });
      return;
    }

    await addReminder({
      title: title.trim(),
      type,
      repeat,
      discreteMode,
      time: formatTime(time),
    });

    Toast.show({
      type: "success",
      text1: t("reminders.toastSuccessTitle"),
      text2: t("reminders.toastSaved"),
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.createContainer}>
      <View style={styles.createHeader}>
        <TouchableOpacity style={styles.createBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={[styles.createHeaderTitle, isRTL && { textAlign: "right" }]}>
          {t("reminders.createTitle")}
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.createContent, { paddingBottom: 120 }]}>
        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, isRTL && { textAlign: "right" }]}>
            {t("reminders.sectionInfo")}
          </Text>
          <Text style={[styles.formLabel, isRTL && { textAlign: "right" }]}>
            {t("reminders.reminderTitleLabel")}
          </Text>
          <TextInput
            style={[styles.formInput, isRTL && { textAlign: "right" }]}
            placeholder={t("reminders.reminderTitlePlaceholder")}
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, isRTL && { textAlign: "right" }]}>
            {t("reminders.sectionType")}
          </Text>
          <View style={styles.typeGrid}>
            {types.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.typeOption, type === item.key && styles.typeOptionSelected]}
                onPress={() => setType(item.key)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={18}
                    color={type === item.key ? colors.primary : colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.typeOptionText,
                      type === item.key && styles.typeOptionTextSelected,
                      isRTL && { textAlign: "right" },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, isRTL && { textAlign: "right" }]}>
            {t("reminders.sectionTime")}
          </Text>
          <TouchableOpacity style={styles.timePicker} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.timePickerText}>{formatTime(time)}</Text>
            <MaterialCommunityIcons name="clock-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          {showTimePicker ? (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, selectedTime) => {
                setShowTimePicker(Platform.OS === "ios");
                if (selectedTime) setTime(selectedTime);
              }}
            />
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, isRTL && { textAlign: "right" }]}>
            {t("reminders.sectionFrequency")}
          </Text>
          <View style={styles.repeatOptions}>
            {repeats.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.repeatOption, repeat === item.key && styles.repeatOptionSelected]}
                onPress={() => setRepeat(item.key)}
              >
                <Text
                  style={[
                    styles.repeatOptionText,
                    repeat === item.key && styles.repeatOptionTextSelected,
                    isRTL && { textAlign: "right" },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.formSectionTitle, isRTL && { textAlign: "right" }]}>
            {t("reminders.sectionPrivacy")}
          </Text>
          <View style={styles.discreteRow}>
            <View style={styles.discreteInfo}>
              <Text style={[styles.discreteTitle, isRTL && { textAlign: "right" }]}>
                {t("reminders.discreteModeTitle")}
              </Text>
              <Text style={[styles.discreteSubtitle, isRTL && { textAlign: "right" }]}>
                {t("reminders.discreteModeSubtitle")}
              </Text>
            </View>
            <Switch
              value={discreteMode}
              onValueChange={setDiscreteMode}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={discreteMode ? colors.primary : colors.textLight}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialCommunityIcons name="content-save" size={20} color="white" />
            <Text style={styles.saveButtonText}>{t("reminders.saveButton")}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateReminderScreen;
