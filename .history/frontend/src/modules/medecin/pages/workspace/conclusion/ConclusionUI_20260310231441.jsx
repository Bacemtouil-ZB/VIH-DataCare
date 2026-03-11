import { formatDate } from "./conclusionHelpers";

export default function ConclusionUI({
  conclusions,
  loading,
  onEdit,
  onPreview
}) {

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (

    <table className="table">

      <thead>
        <tr>
          <th>Médecin</th>
          <th>Date création</th>
          <th>Dernière modification</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {conclusions.map(c => (

          <tr key={c.id}>

            <td>{c.doctor_name || "—"}</td>

            <td>{formatDate(c.created_at)}</td>

            <td>{formatDate(c.updated_at)}</td>

            <td>

              <button onClick={() => onPreview(c)}>
                Voir
              </button>

              <button onClick={() => onEdit(c)}>
                Modifier
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}