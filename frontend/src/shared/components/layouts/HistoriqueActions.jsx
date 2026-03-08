import ActionButton from "./ActionButton";

const styles = `.ec-btn-details { border-radius: 6px; font-weight: 600; }`;

export default function HistoriqueActions({ onDetails, onEdit, onValidate ,onDelete, onCancel }) {
  return (
    <>
      <style>{styles}</style>
      <div className="d-flex gap-2">
        {onDetails && (
          <button className="btn btn-sm btn-outline-secondary ec-btn-details" onClick={onDetails}>Details</button>
        )}
        {onEdit && <ActionButton action="edit" variant="outline" onClick={onEdit} />}
        {onValidate && <ActionButton action="validate" variant="outline" onClick={onValidate} />}
        {onDelete && <ActionButton action="delete" variant="outline" onClick={onDelete} />} 
        {onCancel && <ActionButton action="annuler" variant="outline" onClick={onCancel} />}
      </div>
    </>
  );
}