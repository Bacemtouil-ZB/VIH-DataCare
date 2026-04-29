import React from "react";
import SectionShell from "../../ui/SectionShell.jsx";
import vihLogo from "../../../../../assets/images/vih_logo.png";

const HERO_HIGHLIGHTS = [
  "Centraliser les donnees cliniques, biologiques et therapeutiques dans un dossier unique.",
  "Offrir un suivi complet du patient avec une lecture simple, rapide et intuitive.",
  "Aider les equipes a agir plus vite grace aux alertes, tableaux de bord et priorites visibles.",
];

const HERO_METRICS = [
  { value: "01", label: "Dossier patient clair, structure et toujours accessible" },
  { value: "02", label: "Suivi therapeutique, biologique et clinique dans une meme interface" },
  { value: "03", label: "Coordination continue entre les acteurs de la prise en charge" },
];

function Hero() {
  return (
    <SectionShell className="relative overflow-hidden border-b border-slate-200/80 bg-transparent py-9 md:py-12">
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

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div className="max-w-2xl lg:-mt-4">
          <p className="inline-flex rounded-full border border-[#C8E6C9] bg-[#E8F5E9] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B5E20] shadow-sm">
            Logiciel de suivi VIH
          </p>

          <div className="relative mt-4">
            <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight text-slate-900 md:text-[3.2rem] md:leading-[1.08]">
              Une plateforme de suivi VIH qui met en relief la simplicite, la protection et la qualite de prise en charge
            </h1>
            <div className="mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#2E7D32] via-[#66BB6A] to-[#C8E6C9]" />
          </div>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            VIH DataCare valorise le travail des equipes medicales avec une interface conviviale, un suivi complet
            des patients, des alertes utiles, des tableaux de bord lisibles et une organisation adaptee aux
            besoins hospitaliers et institutionnels.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-slate-600">
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
                  Parcours de suivi
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Une experience plus conviviale pour les equipes
                </h2>
              </div>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F8E9] text-[#1B5E20] shadow-sm">
                <i className="bi bi-shield-check text-xl"></i>
              </span>
            </div>

            <div className="mt-6 grid gap-4">
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
                      Une experience plus simple qui reduit la charge mentale et met les bonnes decisions au bon moment.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#F6FFF7] px-4 py-4 ring-1 ring-[#C8E6C9]/60">
                <p className="text-2xl font-semibold text-slate-900">Alertes</p>
                <p className="mt-1 text-sm text-slate-600">Notifications utiles pour les retards, rendez-vous et suivis sensibles.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <p className="text-2xl font-semibold text-slate-900">Dashboard</p>
                <p className="mt-1 text-sm text-slate-600">Vision synthese des indicateurs utiles pour piloter la prise en charge.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <p className="text-2xl font-semibold text-slate-900">Protection</p>
                <p className="mt-1 text-sm text-slate-600">Confidentialite et securisation des donnees de sante au coeur du systeme.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export default Hero;
