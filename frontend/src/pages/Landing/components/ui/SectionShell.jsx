import React from "react";

function SectionShell({ id, className = "", children }) {
  return (
    <section id={id} className={`w-full px-4 md:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export default SectionShell;