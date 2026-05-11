import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import vihLogo from "../../../../../assets/images/vih_logo.png";

const HERO_HIGHLIGHTS = [
  "Dossier patient centralise",
  "Suivi complet et simple",
  "Alertes et tableaux de bord",
];

const HERO_METRICS = [
  { value: "01", label: "Dossier patient accessible" },
  { value: "02", label: "Suivi therapeutique et biologique" },
  { value: "03", label: "Coordination entre acteurs" },
];

function Hero() {
  return (
    <SectionShell className="relative overflow-hidden border-b border-slate-200/80 bg-transparent py-8 md:py-10">
      <div className="pointer-events-none absolute -left-10 top-16 h-40 w-40 rounded-full bg-[#E8F5E9] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#C8E6C9]/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-[#DCEDC8]/70 blur-3xl" />
      <img
        src={vihLogo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[25%] top-8 hidden w-[26rem] max-w-none rotate-[20deg] opacity-[0.40] blur-[0.4px] lg:block"
      />
      <img
        src={vihLogo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-6 w-24 opacity-[0.12] sm:w-28 lg:w-36"
      />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div className="max-w-2xl lg:-mt-4">
          <p className="inline-flex rounded-full border border-[#C8E6C9] bg-[#E8F5E9] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B5E20] shadow-sm">
            Logiciel de suivi VIH
          </p>

          <div className="relative mt-3">
            <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight text-slate-900 md:text-[3.2rem] md:leading-[1.08]">
              Suivi VIH simple et securise
            </h1>
            <div className="mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#2E7D32] via-[#66BB6A] to-[#C8E6C9]" />
          </div>

          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Une plateforme pour les equipes medicales.
          </p>

          <div className="mt-6 grid gap-2.5 text-sm text-slate-600">
            {HERO_HIGHLIGHTS.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm ring-1 ring-slate-100 backdrop-blur-sm"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F5E9] text-[#1B5E20]">
                  <i className="bi bi-check2"></i>
                </span>
                <p className="m-0 leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1B5E20]">
                  Suivi
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Interface intuitive
                </h2>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F8E9] text-[#1B5E20] shadow-sm">
                <i className="bi bi-shield-check text-xl"></i>
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {HERO_METRICS.map((metric) => (
                <div
                  key={metric.value}
                  className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4"
                >
                  <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[#1B5E20] shadow-sm ring-1 ring-slate-100">
                    {metric.value}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Experience simple et efficace.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#F6FFF7] px-4 py-4 ring-1 ring-[#C8E6C9]/60">
                <p className="text-2xl font-semibold text-slate-900">Alertes</p>
                <p className="mt-1 text-sm text-slate-600">Notifications intelligentes.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <p className="text-2xl font-semibold text-slate-900">Dashboard</p>
                <p className="mt-1 text-sm text-slate-600">Vision des indicateurs.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <p className="text-2xl font-semibold text-slate-900">Protection</p>
                <p className="mt-1 text-sm text-slate-600">Securite des donnees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export default Hero;
