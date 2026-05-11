import React from "react";

function SectionHeading({ badge, title, description }) {
  return (
    <div className="max-w-3xl">
      {badge && (
        <p className="inline-flex rounded-full border border-[#C8E6C9] bg-[#F6FFF7] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B5E20] shadow-sm">
          {badge}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 md:text-[2.15rem] md:leading-[1.2]">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-base leading-7 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
