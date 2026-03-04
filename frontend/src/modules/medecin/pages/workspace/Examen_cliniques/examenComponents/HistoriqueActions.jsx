import { BtnModifier } from "./BtnModifier";

const styles = `.ec-btn-details { border-radius: 6px; font-weight: 600; }`;

export function HistoriqueActions({ onDetails, onEdit }) {
  return (
    <>
      <style>{styles}</style>
      <div className="d-flex gap-2">
        {onDetails && (
          <button className="btn btn-sm btn-outline-secondary ec-btn-details" onClick={onDetails}>Details</button>
        )}
        {onEdit && <BtnModifier onClick={onEdit} />}
      </div>
    </>
  );
}

