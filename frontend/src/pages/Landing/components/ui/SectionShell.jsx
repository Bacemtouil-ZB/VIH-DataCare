import React from "react";

function SectionShell({ id, className = "", children }) {
  return (
    <section id={id} className={`w-full px-5 md:px-8 lg:px-10 ${className}`}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export default SectionShell;
