import React from "react";
import { Alert as BootstrapAlert } from "react-bootstrap";

// Configuration des alertes selon la quantité
const getAlertConfig = (quantity) => {
  if (quantity === 0) {
    return {
      variant: "danger",
      icon: "bi bi-x-circle-fill",
      text: "Rupture de stock",
      show: true,
    };
  } else if (quantity > 0 && quantity <= 5) {
    return {
      variant: "warning",
      icon: "bi bi-exclamation-triangle-fill",
      text: "Stock faible",
      show: true,
    };
  } else if (quantity > 5 && quantity <= 20) {
    return {
      variant: "info",
      icon: "bi bi-info-circle-fill",
      text: "Stock disponible",
      show: true,
    };
  } else {
    return {
      variant: "success",
      icon: "bi bi-check-circle-fill",
      text: "Stock élevé",
      show: true,
    };
  }
};

export default function StockAlert({ quantity }) {
  const config = getAlertConfig(quantity);

  if (!config.show) return null;

  return (
    <BootstrapAlert
      variant={config.variant}
      className="mb-0 py-1 px-2 d-inline-flex align-items-center gap-2"
      style={{
        fontSize: "0.75rem",
        fontWeight: 600,
        borderRadius: "6px",
        whiteSpace: "nowrap",
      }}
    >
      <i className={config.icon} style={{ fontSize: "0.85rem" }}></i>
      <span>{config.text}</span>
    </BootstrapAlert>
  );
}

/**
 * VARIANTES DISPONIBLES:
 * - danger (rouge): Rupture de stock (quantité = 0)
 * - warning (jaune): Stock faible (quantité 1-5)
 * - info (bleu): Stock disponible (quantité 6-20)
 * - success (vert): Stock élevé (quantité > 20)
 */