import React from "react";

function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <div>
          <p className="text-base font-semibold text-[#1B5E20]">VIH DataCare</p>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <span>Service hospitalier de suivi et de prise en charge des patients vivant avec le VIH.</span>
          <span>© 2026 VIHDataCare · Tous droits réservés .</span>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
