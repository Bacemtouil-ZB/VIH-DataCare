import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
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

const IconRetour = () => (
  <Text style={{ fontSize: 22, color: "#1E293B", lineHeight: 24 }}>←</Text>
);

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
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748B",
  },
  errorCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 20,
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
    lineHeight: 20,
  },
  accessDeniedWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  accessDeniedIconWrapper: {
    backgroundColor: "#EEF2FF",
    borderRadius: 50,
    padding: 20,
    marginBottom: 8,
  },
  accessDeniedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  accessDeniedText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
  textAlignRight: {
    textAlign: "right",
  },
});

export default SuiviScreen;