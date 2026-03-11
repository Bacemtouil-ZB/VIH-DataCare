import { STATUS_COLORS } from "./rendezVousConstants";

export const getStatusStyle = (status) => STATUS_COLORS[status] || { bg: "#f1f5f9", color: "#334155" };
