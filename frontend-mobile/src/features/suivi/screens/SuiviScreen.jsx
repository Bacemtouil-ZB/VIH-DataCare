import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useSuivi from "../hooks/useSuivi";
import CD4Chart from "../components/CD4Chart";
import ChargeViraleChart from "../components/ChargeViraleChart";
import useI18n from "../../../i18n/useI18n";
import styles from "../styles/suivi.styles";

const IconRetour = () => <Text style={styles.iconRetour}>{"\u2190"}</Text>;

const SuiviScreen = () => {
  const navigation = useNavigation();
  const { t, isRTL } = useI18n();
  const { graphiques, permissions, loading, error } = useSuivi();

  const canViewCD4 = permissions?.can_view_cd4 ?? true;
  const canViewCV = permissions?.can_view_viral_load ?? true;
  const noChartAccess = !canViewCD4 && !canViewCV;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={[styles.loadingText, isRTL && styles.textAlignRight]}>
            {t("common.loadingData")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconRetour />
        </TouchableOpacity>

        <View style={styles.headerTexts}>
          <Text style={[styles.headerTitle, isRTL && styles.textAlignRight]}>
            {t("suivi.title")}
          </Text>
          <Text style={[styles.headerSubtitle, isRTL && styles.textAlignRight]}>
            {t("suivi.subtitle")}
          </Text>
        </View>
      </View>

      {error ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.errorCard}>
            <MaterialCommunityIcons name="alert-circle-outline" size={36} color="#DC2626" />
            <Text style={[styles.errorText, isRTL && styles.textAlignRight]}>{error}</Text>
          </View>
        </ScrollView>
      ) : noChartAccess ? (
        <View style={styles.accessDeniedWrapper}>
          <View style={styles.accessDeniedIconWrapper}>
            <MaterialCommunityIcons name="chart-timeline-variant" size={48} color="#6366F1" />
          </View>
          <Text style={[styles.accessDeniedTitle, isRTL && styles.textAlignRight]}>
            {t("suivi.accessRestrictedTitle")}
          </Text>
          <Text style={[styles.accessDeniedText, isRTL && styles.textAlignRight]}>
            {t("suivi.accessRestrictedMessage")}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CD4Chart
            data={graphiques?.cd4 ?? []}
            periodes={graphiques?.periodes ?? []}
            authorized={canViewCD4}
          />
          <ChargeViraleChart
            data={graphiques?.cv ?? []}
            periodes={graphiques?.periodes ?? []}
            authorized={canViewCV}
          />
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SuiviScreen;
