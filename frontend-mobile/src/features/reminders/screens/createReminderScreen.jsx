import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useReminderStore from '../../../store/reminderStore';
import styles from '../styles/reminders.styles';
import colors from '../../../constants/colors';

const TYPES = [
  { key: 'medicament', label: 'Médicament', icon: 'pill' },
  { key: 'rendezvous', label: 'Rendez-vous', icon: 'calendar-heart' },
  { key: 'analyse', label: 'Analyse', icon: 'test-tube' },
  { key: 'autre', label: 'Autre', icon: 'bell-outline' },
];

const REPEATS = [
  { key: 'daily', label: 'Quotidien' },
  { key: 'weekly', label: 'Hebdo' },
  { key: 'once', label: 'Une fois' },
];

const CreateReminderScreen = () => {
  const navigation = useNavigation();
  const { addReminder } = useReminderStore();

  const [title, setTitle] = useState('');
  const [type, setType] = useState('medicament');
  const [repeat, setRepeat] = useState('daily');
  const [discreteMode, setDiscreteMode] = useState(true);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez entrer un titre pour le rappel',
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
      type: 'success',
      text1: 'Succès',
      text2: 'Rappel enregistré',
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.createContainer}>
      {/* Header */}
      <View style={styles.createHeader}>
        <TouchableOpacity
          style={styles.createBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.createHeaderTitle}>Nouveau rappel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.createContent}>

        {/* Title */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Informations</Text>
          <Text style={styles.formLabel}>Titre du rappel</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Ex: Prise du matin"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Type */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Type</Text>
          <View style={styles.typeGrid}>
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.typeOption,
                  type === t.key && styles.typeOptionSelected,
                ]}
                onPress={() => setType(t.key)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialCommunityIcons
                    name={t.icon}
                    size={18}
                    color={type === t.key ? colors.white : colors.textPrimary}
                  />
                  <Text
                    style={[
                      styles.typeOptionText,
                      type === t.key && styles.typeOptionTextSelected,
                    ]}
                  >
                    {t.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Heure</Text>
          <TouchableOpacity
            style={styles.timePicker}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timePickerText}>{formatTime(time)}</Text>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedTime) setTime(selectedTime);
              }}
            />
          )}
        </View>

        {/* Repeat */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Fréquence</Text>
          <View style={styles.repeatOptions}>
            {REPEATS.map((r) => (
              <TouchableOpacity
                key={r.key}
                style={[
                  styles.repeatOption,
                  repeat === r.key && styles.repeatOptionSelected,
                ]}
                onPress={() => setRepeat(r.key)}
              >
                <Text
                  style={[
                    styles.repeatOptionText,
                    repeat === r.key && styles.repeatOptionTextSelected,
                  ]}
                >
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Discrete Mode */}
        <View style={styles.formSection}>
          <Text style={styles.formSectionTitle}>Confidentialité</Text>
          <View style={styles.discreteRow}>
            <View style={styles.discreteInfo}>
              <Text style={styles.discreteTitle}>Mode discret</Text>
              <Text style={styles.discreteSubtitle}>
                La notification affichera "Rappel santé" au lieu du titre exact
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

        {/* Save */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MaterialCommunityIcons name="content-save" size={20} color="white" />
            <Text style={styles.saveButtonText}>Enregistrer le rappel</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateReminderScreen;