import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#101828",
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  description: {
    fontSize: 12.5,
    color: "#667085",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F4F7",
    marginBottom: 14,
  },
  actions: {
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  red: {
    backgroundColor: "#1C1C1E",
    borderColor: "#3A3A3C",
  },
  green: {
    backgroundColor: "#1C1C1E",
    borderColor: "#3A3A3C",
  },
  blue: {
    backgroundColor: "#1C1C1E",
    borderColor: "#3A3A3C",
  },
  actionText: {
    color: "#EBEBF5",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    letterSpacing: 0.15,
  },
});

export default styles;