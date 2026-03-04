//used for antecedents form 
export default function ListSection({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel,
  disabled = false,
}) {
  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            marginBottom: 10,
          }}
        >
          <div style={{ flex: 1 }}>{renderItem(item, i)}</div>

          {items.length > 1 && !disabled && (
            <button
              onClick={() => onRemove(i)}
              style={{
                background: "none",
                border: "1px solid #fca5a5",
                color: "#ef4444",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 13,
                marginTop: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {!disabled && (
        <button
          onClick={onAdd}
          style={{
            fontSize: 12.5,
            color: "#1a7a5e",
            background: "none",
            border: "1px dashed #1a7a5e",
            borderRadius: 6,
            padding: "6px 14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}