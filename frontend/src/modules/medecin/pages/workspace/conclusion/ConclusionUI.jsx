import { ActionButton, Spinner } from "../../../../../shared/components";
import { HistoriqueAccordeon, HistoriqueTable, HistoriqueActions } from "../../../../../shared/components";
import { TABLE_HEADERS, formatDate } from "./conclusionConstants.js";

export default function ConclusionUI({
  user,
  total, histOpen, histLoading, conclusions,
  page, totalPages, limit, offset, setOffset,
  onToggleHist, onDetails, onEdit,
  previewItem, setPreviewItem,
}) {
  const renderRow = (c) => {
    const canEdit = Number(c.doctor_id) === Number(user?.id);
    return (
      <tr key={c.id}>
        <td className="align-middle" style={{ fontSize: 13, fontWeight: 600 }}>
          <i className="bi bi-person-circle me-1 text-muted" />
          {c.doctor_name }
        </td>
        <td className="align-middle text-nowrap" style={{ fontSize: 13 }}>
          {formatDate(c.created_at)}
        </td>
        <td className="align-middle text-nowrap" style={{ fontSize: 12, color: "#64748b" }}>
          {formatDate(c.updated_at)}
        </td>
        <td className="align-middle">
          <HistoriqueActions
            onDetails={() => onDetails(c)}
            onEdit={canEdit ? () => onEdit(c) : null}
          />
        </td>
      </tr>
    );
  };

  return (
    <>
      
      <HistoriqueAccordeon
        title="Historique des conclusions"
        count={total}
        open={histOpen}
        onToggle={onToggleHist}
        contentClassName="bg-white p-3"
      >
        {histLoading ? (
          <Spinner />
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
                  Page {page} sur {totalPages} — {total} résultat{total > 1 ? "s" : ""}
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="pcBtnPager"
                    type="button"
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={page <= 1}
                  >
                    <i className="bi bi-chevron-left me-1" /> Précédent
                  </button>
                  <button
                    className="pcBtnPager"
                    type="button"
                    onClick={() => setOffset(offset + limit)}
                    disabled={page >= totalPages}
                  >
                    Suivant <i className="bi bi-chevron-right ms-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </HistoriqueAccordeon>

      {previewItem && (
        <div className="pcModalOverlay" onClick={() => setPreviewItem(null)}>
          <div className="pcModal" onClick={(e) => e.stopPropagation()}>
            <div className="pcModalHeader">
              <div>
                <div className="pcModalTitle">
                  <i className="bi bi-file-earmark-text me-2" />
                    Conclusion médicale — {formatDate(previewItem.created_at)}
                </div>
                <div className="pcModalMeta">
                  <i className="bi bi-person-circle me-1" />
                  {previewItem.doctor_name || "â”"}
                  <span className="mx-2">Â</span>
                 Modifié le {new Date(previewItem.updated_at).toLocaleString()}
                </div>
              </div>
              <button className="pcBtnCancel" onClick={() => setPreviewItem(null)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div
              className="pcModalBody"
              dangerouslySetInnerHTML={{ __html: previewItem.content }}
            />
            <div className="pcModalFooter">
              {Number(previewItem.doctor_id) === Number(user?.id) && (
                <ActionButton
                  action="edit"
                  label="Modifier"
                  onClick={() => { onEdit(previewItem); setPreviewItem(null); }}
                />

              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}



