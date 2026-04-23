import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";
import trustMonitorImage from "../../../../../assets/images/landing-trust-monitor.jpg";

const TRUST_ITEMS = [
  {
    icon: "bi bi-shield-lock-fill",
    eyebrow: "Protection",
    title: "Protection des donnees de sante",
    description:
      "Confidentialite medicale, maitrise des acces et protection des informations patient a chaque etape du parcours.",
  },
  {
    icon: "bi bi-ui-checks-grid",
    eyebrow: "Simplicite",
    title: "Interface simple et conviviale",
    description:
      "Des parcours clairs, des ecrans lisibles et une navigation rassurante pour une adoption rapide par les utilisateurs.",
  },
  {
    icon: "bi bi-graph-up-arrow",
    eyebrow: "Fiabilite",
    title: "Suivi fiable et vision durable",
    description:
      "Le logiciel soutient un usage quotidien stable et une vision de suivi utile aux equipes comme aux responsables.",
  },
];

function TrustSection() {
  return (
    <SectionShell id="fiabilite" className="bg-white py-14 md:py-18">
      <SectionHeading
        badge="Fiabilite"
        title="Une solution qui inspire confiance par sa clarte, sa protection et sa fiabilite"
        description="La plateforme valorise la securite, la simplicite et la continuite du suivi pour offrir une experience serieuse, humaine et durable."
      />

      <div className="mt-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <InfoCard
              key={item.title}
              icon={item.icon}
              eyebrow={item.eyebrow}
              title={item.title}
              description={item.description}
            />
          ))}

          <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
            <img
              src={trustMonitorImage}
              alt="Ecrans de suivi medical illustrant un environnement logiciel fiable et structure"
              className="h-[250px] w-full object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1B5E20]">
                Vision systeme
              </p>
              <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
                Environnement numerique stable et professionnel
              </h3>
            </div>
          </article>
        </div>
      </div>
    </SectionShell>
  );
}

export default TrustSection;
