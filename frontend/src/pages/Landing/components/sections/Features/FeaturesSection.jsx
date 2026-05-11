import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";

const FEATURES = [
  {
    icon: "bi bi-clipboard2-pulse-fill",
    eyebrow: "Suivi clinique",
    title: "Surveillance des patients",
    description: "Indicateurs cliniques et biologiques.",
  },
  {
    icon: "bi bi-journal-medical",
    eyebrow: "Traitement",
    title: "Gestion des prescriptions",
    description: "Protocoles et historique des traitements.",
  },
  {
    icon: "bi bi-bell-fill",
    eyebrow: "Alertes",
    title: "Alertes intelligentes",
    description: "Detection rapide des situations prioritaires.",
  },
  {
    icon: "bi bi-speedometer2",
    eyebrow: "Dashboard",
    title: "Tableaux de bord",
    description: "Vision synthetique des donnees.",
  },
  {
    icon: "bi bi-calendar2-check-fill",
    eyebrow: "Organisation",
    title: "Suivi des rendez-vous",
    description: "Anticipation des actions futures.",
  },
  {
    icon: "bi bi-building",
    eyebrow: "Pilotage",
    title: "Outil pour les etablissements",
    description: "Lecture consolidee des activites.",
  },
];

function FeaturesSection() {
  return (
    <SectionShell id="features" className="border-y border-slate-200 bg-slate-50/80 py-5 md:py-7">
      <SectionHeading
        badge="Fonctionnalites"
        title="Fonctionnalites essentielles"
        description="Modules simples et efficaces."
      />

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <InfoCard
            key={feature.title}
            index={String(index + 1).padStart(2, "0")}
            icon={feature.icon}
            eyebrow={feature.eyebrow}
            title={feature.title}
            description={feature.description}
            tone={index === 0 ? "strong" : "default"}
            size="sm"
          />
        ))}
      </div>
    </SectionShell>
  );
}

export default FeaturesSection;