import React from "react";

const styles = `
.ec-page-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
}

.ec-page-header--bordered {
  border-bottom: 2px solid #e9ecef;
}

.ec-page-header__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2e7d52;
  margin-bottom: 0.5rem;
}

.ec-page-header__subtitle {
  font-size: 0.95rem;
  color: #6c757d;
  margin: 0;
}
`;

export default function PageHeader({ title, subtitle, noBorder = false }) {
  return (
    <>
      <style>{styles}</style>
      <header className={`ec-page-header${noBorder ? "" : " ec-page-header--bordered"}`}>
        <h2 className="ec-page-header__title">{title}</h2>
        {subtitle && <p className="ec-page-header__subtitle">{subtitle}</p>}
      </header>
    </>
  );
}