import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const EmergencyContactCard = ({ contact }) => {
  const handleCall = () => {
    if (contact.telephone) Linking.openURL(`tel:${contact.telephone}`);
  };

  const handleWhatsapp = () => {
    if (contact.whatsapp) Linking.openURL(`https://wa.me/${contact.whatsapp}`);
  };

  const handleEmail = () => {
    if (contact.email) Linking.openURL(`mailto:${contact.email}`);
  };

  return (
    <View style={styles.card}>

      {/* ── Top : Icône + Nom + Description ── */}
      <View style={styles.top}>
        <View style={styles.iconWrapper}>
          <MaterialIcons name="person" size={22} color="#E53E3E" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{contact.nom}</Text>
          {contact.description && (
            <Text style={styles.description}>{contact.description}</Text>
          )}
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Actions ── */}
      <View style={styles.actions}>
        {contact.telephone && (
          <TouchableOpacity style={[styles.actionBtn, styles.red]} onPress={handleCall}>
            <MaterialIcons name="phone" size={15} color="#fff" />
            <Text style={styles.actionText}>{contact.telephone}</Text>
          </TouchableOpacity>
        )}
        {contact.whatsapp && (
          <TouchableOpacity style={[styles.actionBtn, styles.green]} onPress={handleWhatsapp}>
            <MaterialIcons name="chat" size={15} color="#fff" />
            <Text style={styles.actionText}>{contact.whatsapp}</Text>
          </TouchableOpacity>
        )}
        {contact.email && (
          <TouchableOpacity style={[styles.actionBtn, styles.blue]} onPress={handleEmail}>
            <MaterialIcons name="email" size={15} color="#fff" />
            <Text style={styles.actionText} numberOfLines={1}>{contact.email}</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 12,
  },
  actions: {
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  red:   { backgroundColor: "#E53E3E" },
  green: { backgroundColor: "#25D366" },
  blue:  { backgroundColor: "#3B82F6" },
  actionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
});

export default EmergencyContactCard;