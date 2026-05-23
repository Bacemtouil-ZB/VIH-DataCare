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

          <article className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100">
            <div className="p-4 flex flex-col items-start">
              <span className="inline-flex items-center justify-center rounded-md bg-[#E8F5E9] p-2 mb-2">
                <i className="bi bi-eye text-lg text-[#1B5E20]" />
              </span>
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