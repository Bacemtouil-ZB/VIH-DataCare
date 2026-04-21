import React from "react";
import { Link } from "react-router-dom";

function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F5E9] animate-pulse">
            <i className="bi bi-heart-pulse-fill text-3xl text-[#1B5E20]"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-semibold tracking-wide text-slate-900 leading-none">
              VIH DataCare
            </span>
            <span className="mt-1 text-xs text-slate-500">
              Hopital Farhat Hached - Sousse, Tunisie
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[#1B5E20] px-5 py-2 text-sm font-semibold text-white !no-underline shadow-sm transition-colors hover:bg-[#2E7D32] hover:!no-underline"
          >
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;
