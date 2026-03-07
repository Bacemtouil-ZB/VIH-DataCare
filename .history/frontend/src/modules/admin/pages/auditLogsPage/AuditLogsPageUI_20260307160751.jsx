import { fmt, prettyValue, txt } from "./helpers";

const AuditLogsPageUI = ({
  patientNumeroInput,
  setPatientNumeroInput,
  module,
  setModule,
  action,
  setAction,
  from,
  setFrom,
  to,
  setTo,
  loading,
  logs,
  total,
  page,
  totalPages,
  detailsOpen,
  detailsLoading,
  details,
  diffRows,
  modules,
  actionsForModule,
  onSearch,
  openDetails,
  closeDetails,
  onReset,
  next,
  prev,
  setOffset,
}) => {
  return (
    <div className="audit audit--white">
       <header className="audit__header">
        <div>
          <h2 className="audit__title">Audit patient</h2>
          <p className="audit__subtitle">Module/Action en liste</p>
        </div>
      </header>

      <div className="auditContainer">
        <section className="audit__card">
          <form className="audit__row" onSubmit={onSearch}>
            <div className="audit__field audit__field--grow">
              <label className="audit__label">Numéro patient</label>
              <input
                className="audit__input"
                value={patientNumeroInput}
                onChange={(e) => setPatientNumeroInput(e.target.value)}
                placeholder="Ex: VIH-2026-001"
              />
            </div>

            <button className="audit__btn audit__btn--primary" type="submit">
              <i className="bi bi-search" /> Rechercher
            </button>

            <button className="audit__btn" type="button" onClick={onReset} title="Réinitialiser">
              <i className="bi bi-arrow-counterclockwise" /> Reset
            </button>
          </form>

          <div className="audit__filters">
            <div className="audit__field">
              <label className="audit__label">Module</label>
              <select
                className="audit__input"
                value={module}
                onChange={(e) => {
                  setOffset(0);
                  const nextModule = e.target.value;
                  setModule(nextModule);

                  if (nextModule && action) {
                    const actionModule = action.split("_").slice(0, -1).join("_");
                    if (actionModule !== nextModule) setAction("");
                  }
                }}
              >
                <option value="">Tous</option>
                {modules.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="audit__field">
              <label className="audit__label">Action</label>
              <select
                className="audit__input"
                value={action}
                onChange={(e) => {
                  setOffset(0);
                  setAction(e.target.value);
                }}
              >
                <option value="">Toutes</option>
                {actionsForModule.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="audit__field">
              <label className="audit__label">Du</label>
              <input
                className="audit__input"
                type="date"
                value={from}
                onChange={(e) => {
                  setOffset(0);
                  setFrom(e.target.value);
                }}
              />
            </div>

            <div className="audit__field">
              <label className="audit__label">Au</label>
              <input
                className="audit__input"
                type="date"
                value={to}
                onChange={(e) => {
                  setOffset(0);
                  setTo(e.target.value);
                }}
              />
            </div>
          </div>
        </section>

        <div className="auditSpacer" />

        <section className="audit__card audit__card--table">
          <div className="auditTable">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 180 }}>Date</th>
                  <th style={{ width: 320 }}>Médecin</th>
                  <th style={{ width: 170 }}>Module</th>
                  <th style={{ width: 220 }}>Action</th>
                  <th style={{ width: 120 }} />
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="audit__cell audit__muted">
                      Chargement…
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="audit__cell audit__muted">
                      Aucun log. Recherchez un patient.
                    </td>
                  </tr>
                ) : (
                  logs.map((l) => (
                    <tr key={l.id}>
                      <td className="audit__cell">{fmt(l.created_at)}</td>

                      <td className="audit__cell">
                        <div className="audit__strong">
                          {txt(l.user_nom)} {txt(l.user_prenom)}
                        </div>
                        <div className="audit__muted">{txt(l.user_email)}</div>
                      </td>

                      <td className="audit__cell">{txt(l.module)}</td>
                      <td className="audit__cell">{txt(l.action)}</td>

                      <td className="audit__cell audit__cell--right">
                        <button className="audit__btn audit__btn--sm" type="button" onClick={() => openDetails(l.id)}>
                          <i className="bi bi-eye" /> Détails
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="auditPager">
            <div className="audit__muted">
              Total: <span className="audit__strong">{total}</span> • Page {page}/{totalPages}
            </div>
            <div className="auditPager__actions">
              <button className="audit__btn audit__btn--sm" type="button" onClick={prev} disabled={page <= 1}>
                <i className="bi bi-chevron-left" /> Précédent
              </button>
              <button className="audit__btn audit__btn--sm" type="button" onClick={next} disabled={page >= totalPages}>
                Suivant <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        </section>

        {detailsOpen && (
          <div className="auditModal__overlay" onClick={() => closeDetails()}>
            <div
              className="auditModal auditModal--compact"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Détails du log"
            >
              <div className="auditModal__header">
                <div className="auditModal__title">
                  <i className="bi bi-info-circle" /> Détails du log
                </div>

                <div className="auditModal__headerActions">
                  <button className="audit__btn audit__btn--sm" type="button" onClick={closeDetails}>
                    <i className="bi bi-x-lg" /> Fermer
                  </button>
                </div>
              </div>

              <div className="auditModal__body auditModal__body--scroll">
                {detailsLoading ? (
                  <div className="audit__muted">Chargement…</div>
                ) : !details ? (
                  <div className="audit__muted">Aucun détail.</div>
                ) : (
                  <>
                    <div className="auditModal__meta2">
                      <div className="auditMetaRow">
                        <div className="auditMetaRow__k">IP</div>
                        <div className="auditMetaRow__v">{txt(details.ip_address)}</div>
                      </div>

                      <div className="auditMetaRow">
                        <div className="auditMetaRow__k">UA</div>
                        <div className="auditMetaRow__v auditMetaRow__v--mono">{txt(details.user_agent)}</div>
                      </div>
                    </div>

                    <div className="auditModal__section">Comparaison (old_data vs new_data)</div>

                    <div className="auditDiffTable">
                      <table>
                        <thead>
                          <tr>
                            <th style={{ width: 220 }}>Champ</th>
                            <th>Ancien</th>
                            <th>Nouveau</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diffRows.length === 0 ? (
                            <tr>
                              <td className="auditDiff__cell" colSpan={3}>
                                <span className="audit__muted">Aucune donnée à comparer.</span>
                              </td>
                            </tr>
                          ) : (
                            diffRows.map((r) => (
                              <tr key={r.key} className={r.changed ? "auditDiff__row--changed" : ""}>
                                <td className="auditDiff__cell auditDiff__key">{r.key}</td>
                                <td className="auditDiff__cell auditDiff__mono">{prettyValue(r.oldValue)}</td>
                                <td className="auditDiff__cell auditDiff__mono">{prettyValue(r.newValue)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPageUI;