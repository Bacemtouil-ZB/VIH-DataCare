import React from "react";
import { Link } from "react-router-dom";
import ministereLogo from "../../../../assets/images/ministère-removebg-preview.png";
import farhatHachedLogo from "../../../../assets/images/farhathachad-removebg-preview.png";

const NAV_ITEMS = [
  { label: "A propos", href: "#about" },
  { label: "Fonctionnalites", href: "#features" },
  { label: "Fiabilite", href: "#fiabilite" },
];

function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex w-full items-center justify-between gap-4 px-5 py-3 md:px-8 md:py-3 lg:px-10">

        <div className="flex items-center gap-1.5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5E9] shadow-sm ring-1 ring-[#C8E6C9]/70">
            <i className="bi bi-heart-pulse-fill text-3xl text-[#1B5E20]"></i>
          </div>
          <div className="ml-2 flex flex-col">
            <span className="text-xl font-semibold leading-none tracking-wide text-slate-900 md:text-2xl">
              VIH DataCare
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Sousse
            </span>
          </div>
          <div className="ml-2 flex items-center gap-0">
            <img
              src={farhatHachedLogo}
              alt="Logo Hopital Farhat Hached"
              className="h-[2.7rem] w-auto object-contain -mr-1"
            />
            <img
              src={ministereLogo}
              alt="Logo ministere de la Sante"
              className="h-[3.4rem] w-auto object-contain -mr-1"
            />
          </div>
        </div>

        <div className="ml-auto hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-[#1B5E20] hover:!no-underline"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 !no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#A5D6A7] hover:text-[#1B5E20] hover:shadow-md hover:!no-underline md:px-5"
          >
            Connexion
          </Link>

          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-[#1B5E20] px-4 py-2 text-sm font-semibold text-white !no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2E7D32] hover:shadow-md hover:!no-underline md:px-5"
          >
            Inscrirption 
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;
