// ============================================================
//  AlertesBanner.jsx — Version compacte + responsive propre
// ============================================================

import {
  ExclamationCircleFilled,
  WarningFilled,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";

// ── Styles par type ──────────────────────────────────────────
const STYLES = {
  danger: {
    background: "#FFF1F0",
    border: "1px solid #FFA39E",
    borderLeft: "4px solid #E24B4A",
    iconColor: "#E24B4A",
    textColor: "#5C1D1D",
    labelColor: "#A32D2D",
    label: "Critique",
    Icon: ExclamationCircleFilled,
  },
  warning: {
    background: "#FFFBE6",
    border: "1px solid #FFE58F",
    borderLeft: "4px solid #BA7517",
    iconColor: "#BA7517",
    textColor: "#5A4700",
    labelColor: "#854F0B",
    label: "Attention",
    Icon: WarningFilled,
  },
};

// ── Item alerte ──────────────────────────────────────────────
const AlerteItem = ({ alerte, onDismiss }) => {
  const style = STYLES[alerte.type] ?? STYLES.warning;
  const { Icon } = style;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        background: style.background,
        border: style.border,
        borderLeft: style.borderLeft,
        borderRadius: 6,

        // responsive width
        width: "100%",
        maxWidth: "100%",

        boxSizing: "border-box",
      }}
    >
      {/* Icon */}
      <Icon
        style={{
          color: style.iconColor,
          fontSize: 13,
          flexShrink: 0,
        }}
      />

      {/* Texte */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: style.labelColor,
            textTransform: "uppercase",
            marginRight: 4,
          }}
        >
          {style.label} —
        </span>

        <span
          style={{
            fontSize: 11,
            color: style.textColor,
            wordBreak: "break-word",
          }}
        >
          {alerte.message}
        </span>
      </div>

      {/* Close */}
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: style.iconColor,
          opacity: 0.6,
          padding: 0,
          flexShrink: 0,
        }}
      >
        <CloseOutlined style={{ fontSize: 10 }} />
      </button>
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────
const AlertesBanner = ({ alertes = [] }) => {
  const [dismissed, setDismissed] = useState([]);

  if (!alertes || alertes.length === 0) return null;

  const triees = [...alertes]
    .map((a, i) => ({ ...a, _index: i }))
    .filter((a) => !dismissed.includes(a._index))
    .sort((a) => (a.type === "danger" ? -1 : 1));

  if (triees.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",

        // 🔥 responsive auto layout
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",

        gap: 8,
        marginBottom: 12,
      }}
    >
      {triees.map((alerte) => (
        <AlerteItem
          key={alerte._index}
          alerte={alerte}
          onDismiss={() =>
            setDismissed((prev) => [...prev, alerte._index])
          }
        />
      ))}
    </div>
  );
};

export default AlertesBanner;