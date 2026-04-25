import React from "react";

const TONE_STYLES = {
  default:
    "border border-slate-200/90 bg-gradient-to-b from-white to-[#FAFFFA] ring-1 ring-slate-100 hover:border-[#C8E6C9]",
  strong:
    "border border-[#C8E6C9] bg-gradient-to-br from-[#F6FFF7] to-white ring-1 ring-[#C8E6C9]/70 hover:border-[#A5D6A7]",
};

function InfoCard({ index, icon, eyebrow, title, description, tone = "default", size = "default" }) {
  const toneClass = TONE_STYLES[tone] ?? TONE_STYLES.default;
  const isCompact = size === "sm";

  return (
    <article
      className={`rounded-[1.4rem] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isCompact ? "p-4" : "min-h-[250px] p-5 md:p-6"} ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && (
            <span className={`inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#1B5E20] shadow-sm ${isCompact ? "h-8 w-8 text-sm" : "h-11 w-11 text-lg"}`}>
              <i className={icon}></i>
            </span>
          )}
          {eyebrow && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1B5E20]">
              {eyebrow}
            </span>
          )}
        </div>

        {index && (
          <span className={`inline-flex flex-shrink-0 items-center justify-center rounded-full bg-white font-semibold text-[#1B5E20] shadow-sm ring-1 ring-slate-200 ${isCompact ? "h-7 w-7 text-xs" : "h-9 w-9 text-sm"}`}>
            {index}
          </span>
        )}
      </div>

      <h3 className={`font-semibold text-slate-900 ${isCompact ? "mt-2.5 text-sm leading-5" : "mt-5 text-lg leading-7"}`}>
        {title}
      </h3>
      <p className={`text-slate-600 ${isCompact ? "mt-1 text-xs leading-5" : "mt-2 text-sm leading-7"}`}>
        {description}
      </p>
    </article>
  );
}

export default InfoCard;