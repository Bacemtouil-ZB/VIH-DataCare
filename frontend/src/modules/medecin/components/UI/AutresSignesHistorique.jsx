import { Badge } from "./Badge";
const styles = `.ec-histo-desc { font-size: .875rem; color: #1e293b; line-height: 1.4; }`;

export function AutresSignesHistorique({ autresSignes }) {
  if (!autresSignes?.length) return <small className="text-secondary">Aucun</small>;
  return (
    <>
      <style>{styles}</style>
      <div className="d-flex flex-column gap-1">
        {autresSignes.map((as, i) => (
          <div key={i} className="d-flex align-items-start gap-2">
            <Badge bg="#dbeafe" color="#1d4ed8">{as.appareil}</Badge>
            <span className="ec-histo-desc">{as.description}</span>
          </div>
        ))}
      </div>
    </>
  );
}

