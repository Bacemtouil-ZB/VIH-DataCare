export default function ListSection({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel,
}) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="list-row">
          <div className="list-content">
            {renderItem(item, i)}
          </div>

          {items.length > 1 && (
            <button
              onClick={() => onRemove(i)}
              className="btn-remove"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button onClick={onAdd} className="btn-add">
        + {addLabel}
      </button>
    </div>
  );
}