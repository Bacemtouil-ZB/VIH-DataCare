export function EmptyState({ message }) {
  return (
    <div className="text-center py-4 text-secondary">
      <i className="bi bi-inbox fs-4 d-block mb-2"></i>
      <small>{message}</small>
    </div>
  );
}

