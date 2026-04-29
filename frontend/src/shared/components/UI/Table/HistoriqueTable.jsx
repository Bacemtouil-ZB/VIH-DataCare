import EmptyState from "../Alert/EmptyState";

export default function HistoriqueTable({ headers, items, renderRow, emptyMessage = "Aucune donnee" }) {
  if (!items?.length) return <EmptyState message={emptyMessage} />;
  return (
    <div className="table-responsive">
      <table className="table table-hover table-sm mb-0">
        <thead className="table-light">
          <tr>
            {headers.map((h) => (
              <th key={h} className="ec-th-sm">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{items.map((item, idx) => renderRow(item, idx))}</tbody>
      </table>
    </div>
  );
}
