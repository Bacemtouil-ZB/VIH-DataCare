import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";

function TrustSection() {
  return (
    <SectionShell id="fiabilite" className="bg-white py-14 md:py-16">
      <SectionHeading
        badge="Fiabilite"
        title="Une plateforme stable pour l'usage quotidien"
        description="Priorite a la securite, a la lisibilite et a la fiabilite operationnelle."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <InfoCard
          title="Securite des donnees"
          description="Confidentialite medicale et protection des informations patient."
        />
        <InfoCard
          title="Fiabilite operationnelle"
          description="Parcours clairs et comportement stable pour les equipes de soins."
        />
      </div>
    </SectionShell>
  );
}

export default TrustSection;
