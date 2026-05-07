import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import SectionHeading from "../../ui/SectionHeading.jsx";
import InfoCard from "../../ui/InfoCard.jsx";
import trustMonitorImage from "../../../../../assets/images/landing-trust-monitor.jpg";

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
    <SectionShell id="fiabilite" className="bg-white py-7 md:py-9">
      <SectionHeading
        badge="Fiabilite"
        title="Confiance et fiabilite"
        description="Securite, simplicite et continuite."
      />

      <div className="mt-5">
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

          <article className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
            <img
              src={trustMonitorImage}
              alt="Ecrans de suivi medical illustrant un environnement logiciel fiable et structure"
              className="h-[130px] w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1B5E20]">
                Vision systeme
              </p>
              <h3 className="mt-2 text-sm font-semibold leading-5 text-slate-900">
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