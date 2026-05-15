import React from "react";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEmergency } from "../hooks/useEmergency";
import EmergencyContactCard from "../components/EmergencyContactCard";
import Loader from "../../../components/loader";
import ErrorMessage from "../../../components/errorMessage";
import EmptyState from "../../../components/emptyState";
import useI18n from "../../../i18n/useI18n";
import styles from "../styles/urgence.styles";

const IconRetour = () => <Text style={styles.iconRetour}>{"\u2190"}</Text>;

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
            <Text style={[styles.headerTitle, isRTL && styles.textAlignRight]}>
              {t("urgence.title")}
            </Text>
            <Text style={[styles.headerSubtitle, isRTL && styles.textAlignRight]}>
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
          style={styles.bannerIcon}
        />
        <Text style={[styles.bannerText, isRTL && styles.textAlignRight]}>
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

export default UrgenceScreen;
