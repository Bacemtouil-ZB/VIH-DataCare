import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  unit: {
    fontSize: 11,
    color: "#94A3B8",
  },
  legendGroup: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendLine: {
    width: 18,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
  },
  scrollWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  graphWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  scrollContent: {
    paddingRight: 8,
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 13,
  },
  refLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  refDash: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#F59E0B",
  },
  refText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  traitements: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    gap: 6,
  },
  traitementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  traitementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1E40AF",
  },
  traitementNom: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
    flex: 1,
  },
  enCoursBadge: {
    backgroundColor: "#2E7D32",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  enCoursText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  accessDenied: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FED7AA",
    marginTop: 4,
  },
  accessDeniedIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  accessDeniedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C2410C",
    marginBottom: 6,
  },
  accessDeniedText: {
    fontSize: 12,
    color: "#9A3412",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default styles;
