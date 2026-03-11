const styles = `
.ec-page-title {
  color: #408d47;
  font-weight: 700;
  font-size: 20px;
  margin: 0 0 0.75rem 0;
}
`;

export default function PageTitle({ title, className = "" }) {
  return (
    <>
      <style>{styles}</style>
      <h2 className={`ec-page-title ${className}`.trim()}>{title}</h2>
    </>
  );
}
