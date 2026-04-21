import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";

function AboutSection() {
  return (
    <SectionShell id="about" className="bg-white py-14 md:py-16">
      <SectionHeading
        badge="A propos du systeme"
        title="Un outil hospitalier pour le suivi VIH"
        description="Concu pour les equipes medicales de l'hopital Farhat Hached a Sousse."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InfoCard
          title="Suivi patient centralise"
          description="Consultations, bilans et traitements regroupes dans une vue unique."
        />
        <InfoCard
          title="Coordination pluridisciplinaire"
          description="Coordination medecin, laboratoire et pharmacie dans un flux simple."
        />
        <InfoCard
          title="Continuite therapeutique"
          description="Suivi des prescriptions et des ajustements therapeutiques essentiels."
        />
      </div>
    </SectionShell>
  );
}

export default AboutSection;
