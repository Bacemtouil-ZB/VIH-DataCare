import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";
import aboutSoftwareImage from "../../../../../assets/images/landing-about-software.jpg";

const ABOUT_CARDS = [
  {
    icon: "bi bi-person-lines-fill",
    eyebrow: "Suivi complet",
    title: "Dossier patient centralise",
    description: "Consultations et traitements regroupes.",
  },
  {
    icon: "bi bi-people-fill",
    eyebrow: "Coordination",
    title: "Travail d'equipe fluide",
    description: "Base commune pour les intervenants.",
  },
  {
    icon: "bi bi-building-check",
    eyebrow: "Institution",
    title: "Vision adaptee aux structures de sante",
    description: "Usage hospitalier rigoureux et adapte.",
  },
];

function AboutSection() {
  return (
    <SectionShell id="about" className="bg-white py-7 md:py-9">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(240px,0.65fr)] lg:items-start">
        <SectionHeading
          badge="A propos"
          title="Suivi, protection, qualite"
          description="Concu pour les equipes medicales."
        />

        <div className="rounded-[1.5rem] border border-[#C8E6C9]/70 bg-gradient-to-br from-[#F6FFF7] to-white p-4 shadow-sm">
          <div className="overflow-hidden rounded-[1rem]">
            <img
              src={aboutSoftwareImage}
              alt="Professionnelle de sante utilisant une tablette pour le suivi numerique des patients"
              className="h-[180px] w-full rounded-[1rem] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ABOUT_CARDS.map((card) => (
          <InfoCard
            key={card.title}
            icon={card.icon}
            eyebrow={card.eyebrow}
            title={card.title}
            description={card.description}
            size="sm"
          />
        ))}
      </div>
    </SectionShell>
  );
}

export default AboutSection;