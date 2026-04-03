// ============================================================
//  AlertesBanner.jsx
// ============================================================

import {
  ExclamationCircleFilled,
  WarningFilled,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const STYLES = {
  danger: {
    background: "#FFF1F0",
    border: "1px solid #FFA39E",
    borderLeft: "4px solid #E24B4A",
    iconColor: "#E24B4A",
    textColor: "#7A1818",
    labelColor: "#A32D2D",
    label: "Critique",
    Icon: ExclamationCircleFilled,
  },
  warning: {
    background: "#FFFBE6",
    border: "1px solid #FFE58F",
    borderLeft: "4px solid #BA7517",
    iconColor: "#BA7517",
    textColor: "#614700",
    labelColor: "#854F0B",
    label: "Attention",
    Icon: WarningFilled,
  },
};

const AlerteItem = ({ alerte, onDismiss }) => {
  const style = STYLES[alerte.type] ?? STYLES.warning;
  const { Icon } = style;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background: style.background,
      border: style.border,
      borderLeft: style.borderLeft,
      borderRadius: 8,
      flex: "1 1 auto",
      minWidth: 200,
      maxWidth: 500,
      boxSizing: "border-box",
    }}>
      <Icon style={{ color: style.iconColor, fontSize: 14, flexShrink: 0 }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          color: style.labelColor,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginRight: 6,
        }}>
          {style.label} —
        </span>
        <span style={{ fontSize: 12, color: style.textColor }}>
          {alerte.message}
        </span>
      </div>

      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: style.iconColor,
          opacity: 0.5,
          padding: 0,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        <CloseOutlined style={{ fontSize: 11 }} />
      </button>
    </div>
  );
};

const AlertesBanner = ({ alertes = [] }) => {
  const [dismissed, setDismissed] = useState([]);

  if (!alertes || alertes.length === 0) return null;

  const triees = [...alertes]
    .map((a, i) => ({ ...a, _index: i }))
    .filter((a) => !dismissed.includes(a._index))
    .sort((a,) => (a.type === "danger" ? -1 : 1));

  if (triees.length === 0) return null;

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
    }}>
      {triees.map((alerte) => (
        <AlerteItem
          key={alerte._index}
          alerte={alerte}
          onDismiss={() => setDismissed((prev) => [...prev, alerte._index])}
        />
      ))}
    </div>
  );
};

export default AlertesBanner;