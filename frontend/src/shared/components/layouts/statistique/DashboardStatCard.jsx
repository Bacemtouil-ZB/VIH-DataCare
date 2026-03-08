import React from "react";
import { Card } from "react-bootstrap"; // Importer le composant Card de Bootstrap

export default function DashboardStatCard({ label, value, tone = "success" }) {
  // Définir une classe pour appliquer les couleurs en fonction du ton
  const toneClass = `bg-${tone} text-white`;

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{label}</Card.Title>
        <Card.Text className={`fs-3 fw-bold ${toneClass}`}>
          {value}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}