import React from "react";
import { Link } from "react-router-dom";

function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/90 py-10">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-lg font-semibold text-[#1B5E20]">VIH DataCare</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Suivi VIH simple et securise.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href="#about"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 transition-colors hover:text-[#1B5E20] hover:!no-underline"
            >
              A propos
            </a>
            <a
              href="#features"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-600 transition-colors hover:text-[#1B5E20] hover:!no-underline"
            >
              Fonctionnalites
            </a>
            <Link
              to="/signup"
              className="rounded-xl bg-[#1B5E20] px-4 py-2 font-medium text-white !no-underline transition-colors hover:bg-[#2E7D32] hover:!no-underline"
            >
              S'inscrire
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1 border-t border-slate-200 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>Copyright 2026 VIH DataCare. Tous droits reserves.</span>
          <span>Made with love Chayma MANNAI & Bacem TOUIL.</span>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
