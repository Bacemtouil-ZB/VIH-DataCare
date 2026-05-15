import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../styles/emergencyContactCard.styles";

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
      <View style={styles.top}>
        <View style={styles.iconWrapper}>
          <MaterialIcons name="person" size={22} color="#E53E3E" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{contact.nom}</Text>
          {contact.description && <Text style={styles.description}>{contact.description}</Text>}
        </View>
      </View>

      <View style={styles.divider} />

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
            <Text style={styles.actionText} numberOfLines={1}>
              {contact.email}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default EmergencyContactCard;
