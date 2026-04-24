import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEmergency } from "../hooks/useEmergency";
import EmergencyContactCard from "../components/EmergencyContactCard";
import Loader from "../../../components/loader";
import ErrorMessage from "../../../components/errorMessage";
import EmptyState from "../../../components/emptyState";
import useI18n from "../../../i18n/useI18n";

const IconRetour = () => (
  <Text style={{ fontSize: 22, color: "#1E293B", lineHeight: 24 }}>←</Text>
);

const UrgenceScreen = () => {
  const { contacts, loading, error, refetch } = useEmergency();
  const navigation = useNavigation();
  const { t, isRTL } = useI18n();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconRetour />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="warning" size={20} color="#E53E3E" />
          </View>
          <View>
            <Text style={[styles.headerTitle, isRTL && { textAlign: "right" }]}>
              {t("urgence.title")}
            </Text>
            <Text style={[styles.headerSubtitle, isRTL && { textAlign: "right" }]}>
              {t("urgence.availableContacts", { count: contacts.length })}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.banner}>
        <MaterialIcons
          name="info-outline"
          size={16}
          color="#92400E"
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.bannerText, isRTL && { textAlign: "right" }]}>
          {t("urgence.bannerText")}
        </Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => <EmergencyContactCard contact={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} tintColor="#E53E3E" />
        }
        ListEmptyComponent={<EmptyState message={t("urgence.emptyContacts")} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: "#FEF3C7",
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  bannerText: {
    fontSize: 12,
    color: "#92400E",
    lineHeight: 18,
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
});

export default UrgenceScreen;
