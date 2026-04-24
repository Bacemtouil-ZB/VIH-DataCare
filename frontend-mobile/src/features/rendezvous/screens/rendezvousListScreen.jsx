import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useRendezvous from "../hooks/useRendezvous";
import RendezvousCard from "../components/rendezvousCard";
import styles from "../styles/rendezvous.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const RendezvousListScreen = () => {
  const navigation = useNavigation();
  const { t, isRTL } = useI18n();
  const { rendezvous, isLoading, error, refetch } = useRendezvous();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isRTL && { textAlign: "right" }]}>
            {t("rendezvous.listTitle")}
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isRTL && { textAlign: "right" }]}>
            {t("rendezvous.listTitle")}
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorText, isRTL && { textAlign: "right" }]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>{t("common.retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isRTL && { textAlign: "right" }]}>
          {t("rendezvous.listTitle")}
        </Text>
        <Text style={[styles.headerSubtitle, isRTL && { textAlign: "right" }]}>
          {t("rendezvous.totalCount", { count: rendezvous.length })}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {rendezvous.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
            <Text style={[styles.emptyText, isRTL && { textAlign: "right" }]}>
              {t("rendezvous.emptyList")}
            </Text>
          </View>
        ) : (
          rendezvous.map((item, index) => (
            <RendezvousCard
              key={item?.id?.toString() || index.toString()}
              rendezvous={item}
              onPress={() => navigation.navigate("RendezvousDetail", { id: item.id })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RendezvousListScreen;
