import HistoriqueAccordeon from "../../../../../shared/components/layouts/HistoriqueAccordeon";
import HistoriqueTable from "../../../../../shared/components/layouts/HistoriqueTable";
import HistoriqueActions from "../../../../../shared/components/layouts/HistoriqueActions";

import { formatDate } from "./conclusionHelpers";

const TABLE_HEADERS = [
  "Médecin",
  "Date création",
  "Dernière modification",
  "Actions",
];

export default function ConclusionUI({
  conclusions,
  total,
  page,
  totalPages,
  histOpen,
  histLoading,
  onToggleHistory,
  onEdit,
  onPreview,
  onPrevPage,
  onNextPage,
}) {
  const renderRow = (c) => (
    <tr key={c.id}>
      <td className="align-middle">
        <i className="bi bi-person-circle me-1 text-muted" />
        {c.doctor_name || "—"}
      </td>

      <td className="align-middle text-nowrap">
        {formatDate(c.created_at)}
      </td>

      <td className="align-middle text-nowrap text-muted">
        {formatDate(c.updated_at)}
      </td>

      <td className="align-middle">
        <HistoriqueActions
          onDetails={() => onPreview(c)}
          onEdit={() => onEdit(c)}
        />
      </td>
    </tr>
  );

  return (
    <HistoriqueAccordeon
      title="Historique des conclusions"
      count={total}
      open={histOpen}
      onToggle={onToggleHistory}
      contentClassName="bg-white p-3"
    >
      {histLoading ? (
        <div className="d-flex align-items-center gap-2 text-muted py-2">
          <span className="spinner-border spinner-border-sm" />
          Chargement…
        </div>
      ) : (
        <>
          <HistoriqueTable
            headers={TABLE_HEADERS}
            items={conclusions}
            renderRow={renderRow}
            emptyMessage="Aucune conclusion enregistrée pour ce patient."
          />

          {conclusions.length > 0 && (
            <div className="pcPager">
              <div className="text-muted small">
                Page {page} / {totalPages} — {total} résultat
                {total > 1 ? "s" : ""}
              </div>

              <div className="d-flex gap-2">
                <button
                  className="pcBtnPager"
                  onClick={onPrevPage}
                  disabled={page <= 1}
                >
                  <i className="bi bi-chevron-left me-1" />
                  Précédent
                </button>

                <button
                  className="pcBtnPager"
                  onClick={onNextPage}
                  disabled={page >= totalPages}
                >
                  Suivant
                  <i className="bi bi-chevron-right ms-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </HistoriqueAccordeon>
  );
}