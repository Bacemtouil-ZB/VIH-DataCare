import React from "react";

const TONE_STYLES = {
  default:
    "border border-slate-200/90 bg-gradient-to-b from-white to-[#FAFFFA] ring-1 ring-slate-100 hover:border-[#C8E6C9]",
  strong:
    "border border-[#C8E6C9] bg-gradient-to-br from-[#F6FFF7] to-white ring-1 ring-[#C8E6C9]/70 hover:border-[#A5D6A7]",
};

function InfoCard({ index, icon, eyebrow, title, description, tone = "default" }) {
  const toneClass = TONE_STYLES[tone] ?? TONE_STYLES.default;

  return (
    <article className={`min-h-[250px] rounded-[1.75rem] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:p-6 ${toneClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F5E9] text-lg text-[#1B5E20] shadow-sm">
              <i className={icon}></i>
            </span>
          )}
          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1B5E20]">
              {eyebrow}
            </span>
          )}
        </div>

        {index && (
          <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1B5E20] shadow-sm ring-1 ring-slate-200">
            {index}
          </span>
        )}
      </div>

      <h3 className="mt-5 text-lg font-semibold leading-7 text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

export default InfoCard;
