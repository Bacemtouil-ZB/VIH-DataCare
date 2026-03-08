import React from "react";
import { Spinner as BootstrapSpinner } from "react-bootstrap"; // Importer le Spinner de Bootstrap

export function Spinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
      <BootstrapSpinner
        animation="border"
        role="status"
        variant="success"  // Couleur verte de Bootstrap pour le spinner (vous pouvez personnaliser si nécessaire)
      >
        <span className="visually-hidden">Chargement...</span> {/* Accessibilité */}
      </BootstrapSpinner>
    </div>
  );
}