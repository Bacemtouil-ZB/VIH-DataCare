import { ActionButton } from "./ActionButton";

const styles = `.ec-btn-details { border-radius: 6px; font-weight: 600; }`;

export default function HistoriqueActions({
  onDetails,
  onEdit,
  onValidate,
  onDelete,
  onCancel,
  detailsProps = {},
  editProps = {},
  validateProps = {},
  deleteProps = {},
  cancelProps = {},
}) {
  const { label: detailsLabel, ...detailsBtnProps } = detailsProps;

  return (
    <>
      <style>{styles}</style>
      <div className="d-flex gap-2">
        {onDetails && (
          <button
            className="btn btn-sm btn-outline-secondary ec-btn-details"
            onClick={onDetails}
            type="button"
            {...detailsBtnProps}
          >
            {detailsLabel || "Details"}
          </button>
        )}
        {onEdit && <ActionButton action="edit" variant="outline" onClick={onEdit} {...editProps} />}
        {onValidate && (
          <ActionButton action="validate" variant="outline" onClick={onValidate} {...validateProps} />
        )}
        {onDelete && <ActionButton action="delete" variant="outline" onClick={onDelete} {...deleteProps} />}
        {onCancel && <ActionButton action="annuler" variant="outline" onClick={onCancel} {...cancelProps} />}
      </div>
    </>
  );
}
