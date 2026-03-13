import { useAntecedentsLogic } from "./useAntecedentsLogic";

import "./antecedents_style.css";

import { SECTIONS, BOOL_FIELDS } from "./antecedentsConfig.jsx";
import TabNavigation from "../../../components/UI/TabNavigation";
import SectionRenderer from "../../../components/UI/SectionRenderer";

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default function AntecedentsForm() {
  const {
    // state
    active, setActive,
    form,
    versions,
    selectedVersion, setSelectedVersion,
    readOnly,
    loading,
    saving,
    isEditing,
    // derived
    dirtyCount,
    hasDirty,
    isBusy,
    canEdit,
    hasAnyVersion,
    // form mutations
    updateSection,
    updateList,
    addRow,
    removeRow,
    // action handlers
    handleCreateFirst,
    handleEdit,
    handleCancel,
    handleSaveAll,
    handleNewVersion,
  } = useAntecedentsLogic();

  const statusPill = readOnly ? (
    <span className="pill pill-readonly">Lecture seule</span>
  ) : hasDirty ? (
    <span className="pill pill-dirty">{dirtyCount} modifiée(s)</span>
  ) : null;

  return (
    <div className="antecedents-wrapper">
      <div className="antecedents-header">
        <div className="header-content">
          <div className="header-left header-row">
            {hasAnyVersion ? (
              <div className="version-bar">
                <span className="version-label">Version</span>
                <select
                  className="version-select"
                  value={selectedVersion ?? ""}
                  onChange={(e) => setSelectedVersion(Number(e.target.value))}
                  disabled={isBusy}
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.version_number}>
                      {`v${v.version_number} — ${
                        v.status === "active" ? "active" : "archivée"
                      } — ${formatDate(v.created_at)}`}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {hasAnyVersion && (
              <button
                onClick={handleNewVersion}
                className="btn-secondary"
                disabled={isBusy}
              >
                + Nouvelle version
              </button>
            )}

            {statusPill}
          </div>

          <div className="header-right">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveAll}
                  className="btn-primary"
                  disabled={isBusy || readOnly}
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button onClick={handleCancel} className="btn-secondary" disabled={isBusy}>
                  Annuler
                </button>
              </>
            ) : hasAnyVersion ? (
              <button
                onClick={handleEdit}
                className="btn-secondary"
                disabled={isBusy || readOnly}
              >
                Modifier
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {!hasAnyVersion && (
        <div className="empty-state-card">
          <h3 className="empty-state-title">Aucune fiche d'antécédents</h3>
          <p className="empty-state-text">
            Créez la première fiche pour commencer la saisie des antécédents.
          </p>
          <button
            onClick={handleCreateFirst}
            className="btn-primary"
            disabled={isBusy}
          >
            {loading ? "Création..." : "Créer la fiche"}
          </button>
        </div>
      )}

      <div className="antecedents-container">
        {hasAnyVersion ? (
          <>
            <TabNavigation sections={SECTIONS} active={active} onChange={setActive} />

            {loading ? (
              <div className="loading">Chargement...</div>
            ) : (
              <SectionRenderer
                active={active}
                form={form}
                BOOL_FIELDS={BOOL_FIELDS}
                updateSection={updateSection}
                updateList={updateList}
                addRow={addRow}
                removeRow={removeRow}
                readOnly={!canEdit}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}