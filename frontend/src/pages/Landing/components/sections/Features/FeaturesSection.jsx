import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";

const FEATURES = [
  {
    icon: "bi bi-clipboard2-pulse-fill",
    eyebrow: "Suivi clinique",
    title: "Surveillance complete des patients",
    description:
      "Suivi dans le temps des indicateurs cliniques, biologiques et therapeutiques avec une lecture immediate.",
  },
  {
    icon: "bi bi-journal-medical",
    eyebrow: "Traitement",
    title: "Gestion des traitements et prescriptions",
    description:
      "Gestion des protocoles, renouvellements, ajustements et historique des prescriptions dans un parcours simple.",
  },
  {
    icon: "bi bi-bell-fill",
    eyebrow: "Alertes",
    title: "Alertes et notifications intelligentes",
    description:
      "Detection rapide des retards de suivi, rendez-vous manques et situations a prioriser pour agir sans delai.",
  },
  {
    icon: "bi bi-speedometer2",
    eyebrow: "Dashboard",
    title: "Tableaux de bord et vision synthese",
    description:
      "Les informations prioritaires et indicateurs utiles restent visibles pour faciliter le pilotage et l'analyse.",
  },
  {
    icon: "bi bi-calendar2-check-fill",
    eyebrow: "Organisation",
    title: "Suivi des rendez-vous et echeances",
    description:
      "Une meilleure lisibilite des echeances aide les equipes a anticiper les prochaines actions et a mieux planifier.",
  },
  {
    icon: "bi bi-building",
    eyebrow: "Pilotage",
    title: "Outil utile aux etablissements et au ministere de la Sante",
    description:
      "Le systeme facilite une lecture consolidee des activites et peut soutenir le suivi, l'organisation et le pilotage institutionnel.",
  },
];

function FeaturesSection() {
  return (
    <SectionShell id="features" className="border-y border-slate-200 bg-slate-50/80 py-14 md:py-18">
      <SectionHeading
        badge="Fonctionnalites"
        title="Des fonctionnalites concretes pour accompagner tout le parcours de prise en charge"
        description="Chaque module a ete pense pour rendre le logiciel plus utile, plus simple a utiliser et plus efficace pour le suivi quotidien des patients."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <InfoCard
            key={feature.title}
            index={String(index + 1).padStart(2, "0")}
            icon={feature.icon}
            eyebrow={feature.eyebrow}
            title={feature.title}
            description={feature.description}
            tone={index === 0 ? "strong" : "default"}
          />
        ))}
      </div>
    </SectionShell>
  );
}

export default FeaturesSection;
