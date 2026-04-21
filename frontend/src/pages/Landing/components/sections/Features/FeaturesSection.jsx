import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";

const FEATURES = [
  {
    title: "Surveillance des patients",
    description:
      "Suivi des indicateurs cliniques et biologiques dans le temps.",
  },
  {
    title: "Suivi des traitements et prescriptions",
    description:
      "Gestion des protocoles, renouvellements et historique des prescriptions.",
  },
  {
    title: "Alertes et notifications",
    description:
      "Detection rapide des retards de suivi et rendez-vous manques.",
  },
];

function FeaturesSection() {
  return (
    <SectionShell id="features" className="border-y border-slate-200 bg-slate-50 py-14 md:py-16">
      <SectionHeading
        badge="Fonctionnalites"
        title="Fonctionnalites essentielles"
        description="Des modules clairs pour agir rapidement en pratique clinique."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <InfoCard
            key={feature.title}
            index={String(index + 1).padStart(2, "0")}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </SectionShell>
  );
}

export default FeaturesSection;
