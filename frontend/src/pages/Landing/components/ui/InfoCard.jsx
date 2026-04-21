import React from "react";

function InfoCard({ index, title, description }) {
  return (
    <article className="min-h-[230px] rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-[#FAFFFA] p-5 md:p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:border-[#C8E6C9] hover:shadow-md">
      {index && (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-sm font-semibold text-[#1B5E20]">
          {index}
        </span>
      )}
      <h3 className="mt-4 text-lg font-semibold leading-7 text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

export default InfoCard;
