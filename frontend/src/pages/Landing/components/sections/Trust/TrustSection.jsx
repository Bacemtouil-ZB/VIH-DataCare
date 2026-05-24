import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";

const TRUST_ITEMS = [
  {
    icon: "bi bi-shield-lock-fill",
    eyebrow: "Protection",
    title: "Protection des donnees",
    description: "Confidentialite et maitrise des acces.",
  },
  {
    icon: "bi bi-ui-checks-grid",
    eyebrow: "Simplicite",
    title: "Interface conviviale",
    description: "Parcours clairs et navigation simple.",
  },
  {
    icon: "bi bi-graph-up-arrow",
    eyebrow: "Fiabilite",
    title: "Suivi fiable",
    description: "Usage stable et durable.",
  },
];

function TrustSection() {
  return (
    <SectionShell id="fiabilite" className="bg-white py-5 md:py-7">
      <SectionHeading
        badge="Fiabilite"
        title="Confiance et fiabilite"
        description="Securite, simplicite et continuite."
      />

      <div className="mt-3">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <InfoCard
              key={item.title}
              icon={item.icon}
              eyebrow={item.eyebrow}
              title={item.title}
              description={item.description}
              size="sm"
            />
          ))}
          <InfoCard
            key="Vision systeme"
            icon="bi bi-eye"
            eyebrow="Vision systeme"
            title="Environnement numerique stable et professionnel"
            description=""
            size="sm"
            iconColor="#1B5E20"
            iconBg="#E8F5E9"
          />
        </div>
      </div>
    </SectionShell>
  );
}

export default TrustSection;