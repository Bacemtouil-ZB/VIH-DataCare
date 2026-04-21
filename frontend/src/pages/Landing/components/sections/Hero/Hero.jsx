import React from "react";
import { Link } from "react-router-dom";
import SectionShell from "../../ui/SectionShell.jsx";

function Hero() {
  return (
    <SectionShell className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-100 via-white to-slate-50 py-12 md:py-16">
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#C8E6C9]/60 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="max-w-2xl">
          <p className="inline-flex rounded-full border border-[#C8E6C9] bg-[#E8F5E9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B5E20]">
            Plateforme clinique VIH
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-tight text-slate-900 md:text-[3.05rem] md:leading-[1.12]">
            Gestion et suivi clinique des patients vivant avec le VIH
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Une interface claire, fiable et securisee pour faciliter la prise de decision clinique.
          </p>

          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#1B5E20] px-8 py-3 text-sm font-semibold text-white !no-underline shadow-sm transition-colors hover:bg-[#2E7D32] hover:!no-underline"
            >
              Connexion
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Capacites cliniques
          </h2>

          <div className="mt-5 space-y-4">
            <article>
              <h3 className="text-base font-semibold text-slate-900">Vue patient unifiee</h3>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                Dossier, bilans et traitements centralises.
              </p>
            </article>
            <article>
              <h3 className="text-base font-semibold text-slate-900">Alertes et priorisation</h3>
              <p className="mt-1 text-sm leading-7 text-slate-600">
                Retards et actions de suivi identifies rapidement.
              </p>
            </article>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export default Hero;
