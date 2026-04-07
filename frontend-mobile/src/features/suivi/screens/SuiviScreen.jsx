
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import useSuivi from "../hooks/useSuivi";
import CD4Chart from "../components/CD4Chart";
import ChargeViraleChart from "../components/ChargeViraleChart";

// ── Icône retour simple (sans lib d'icônes) ───────────────────
const IconRetour = () => (
  <Text style={{ fontSize: 22, color: "#1E293B", lineHeight: 24 }}>←</Text>
);

// ── Composant erreur ──────────────────────────────────────────
const ErreurCard = ({ message, onRetry }) => (
  <View style={styles.erreurCard}>
    <Text style={styles.erreurIcone}>⚠️</Text>
    <Text style={styles.erreurTexte}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryTexte}>Réessayer</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── Composant loading ─────────────────────────────────────────
const LoadingState = () => (
  <View style={styles.loadingWrapper}>
    <ActivityIndicator size="large" color="#6366F1" />
    <Text style={styles.loadingTexte}>Chargement des données…</Text>
  </View>
);

// ── Écran principal ───────────────────────────────────────────
const SuiviScreen = () => {
  const navigation = useNavigation();
  const { graphiques, loading, error } = useSuivi();

  // ── Permissions par graphique ─────────────────────────────
  // À brancher sur ton système de permissions réel.
  // Exemple : const { autorisations } = useAuthStore()
  // Pour l'instant : toujours autorisé (à adapter)
  const autoriseCD4 = true;  // remplace par: autorisations?.cd4 ?? true
  const autoriseCV  = true;  // remplace par: autorisations?.cv  ?? true

  const aucunGraphique = !autoriseCD4 && !autoriseCV;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.retourBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconRetour />
        </TouchableOpacity>

        <View style={styles.headerTextes}>
          <Text style={styles.headerTitre}>Suivi biologique</Text>
          <Text style={styles.headerSousTitre}>CD4 · Charge virale</Text>
        </View>
      </View>

      {/* ── Contenu ── */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ErreurCard message={error} />
        </ScrollView>
      ) : aucunGraphique ? (
        <View style={styles.accesRefuseWrapper}>
          <Text style={styles.accesRefuseIcone}>🔒</Text>
          <Text style={styles.accesRefuseTitre}>Accès restreint</Text>
          <Text style={styles.accesRefuseTexte}>
            Votre médecin n'a pas autorisé l'accès aux données biologiques.
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
              autorisé={autoriseCD4}
            />

            <ChargeViraleChart
              data={graphiques?.cv ?? []}
              periodes={graphiques?.periodes ?? []}
              autorisé={autoriseCV}
            />

          {/* Spacer bas de page */}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // Header
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
  retourBtn: {
    padding: 4,
  },
  headerTextes: {
    flex: 1,
  },
  headerTitre: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
  },
  headerSousTitre: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },

  // Loading
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingTexte: {
    fontSize: 14,
    color: "#64748B",
  },

  // Erreur
  erreurCard: {
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 20,
  },
  erreurIcone: {
    fontSize: 28,
  },
  erreurTexte: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    backgroundColor: "#DC2626",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 4,
  },
  retryTexte: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },

  // Accès refusé
  accesRefuseWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 10,
  },
  accesRefuseIcone: {
    fontSize: 40,
    marginBottom: 4,
  },
  accesRefuseTitre: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  accesRefuseTexte: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default SuiviScreen;