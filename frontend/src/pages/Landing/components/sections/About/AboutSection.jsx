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
    description:
      "Consultations, bilans, traitements, alertes et informations utiles sont regroupes dans une seule vue claire.",
  },
  {
    icon: "bi bi-people-fill",
    eyebrow: "Coordination",
    title: "Travail d'equipe plus fluide",
    description:
      "Medecins, pharmacie et autres intervenants avancent sur une base commune avec moins de ruptures d'information.",
  },
  {
    icon: "bi bi-building-check",
    eyebrow: "Institution",
    title: "Vision adaptee aux structures de sante",
    description:
      "La plateforme soutient un usage hospitalier rigoureux et peut accompagner les besoins de pilotage des etablissements et du ministere de la Sante.",
  },
];

function AboutSection() {
  return (
    <SectionShell id="about" className="bg-white py-14 md:py-18">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.75fr)] lg:items-start">
        <SectionHeading
          badge="A propos du systeme"
          title="Un logiciel de sante pense pour mieux suivre, mieux proteger et mieux decider"
          description="Concu pour les equipes medicales de l'hopital Farhat Hached a Sousse, VIH DataCare met en avant la simplicite d'usage, la convivialite de l'interface et la qualite du suivi clinique."
        />

        <div className="rounded-[1.75rem] border border-[#C8E6C9]/70 bg-gradient-to-br from-[#F6FFF7] to-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-[1.25rem]">
            <img
              src={aboutSoftwareImage}
              alt="Professionnelle de sante utilisant une tablette pour le suivi numerique des patients"
              className="h-[280px] w-full rounded-[1.25rem] object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ABOUT_CARDS.map((card) => (
          <InfoCard
            key={card.title}
            icon={card.icon}
            eyebrow={card.eyebrow}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </SectionShell>
  );
}

export default AboutSection;
