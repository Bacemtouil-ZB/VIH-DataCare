import { fmt, prettyValue, txt } from "./helpers";
import { getModuleLabel, getActionLabel } from "./constante";
import PageHeader from "../../components/PageHeader";
import {
  ActionButton,
  FilterToolbar,
  HistoriqueActions,
  HistoriqueTable,
  Spinner,
} from "../../../../shared/components/index";

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

  const tableHeaders = ["Date", "Médecin", "Module", "Action", ""];

  const numeroError =
    patientNumeroInput &&
    !/^\d{4}-\d{4}$/.test(patientNumeroInput)
      ? "Format invalide (ex: 0001-2025)"
      : "";

  const renderLogRow = (l) => {
    return (
      <tr key={l.id}>
        <td className="audit__cell">{fmt(l.created_at)}</td>
        <td className="audit__cell">
          <div className="audit__strong">
            {txt(l.user_nom)} {txt(l.user_prenom)}
          </div>
          <div className="audit__muted">{txt(l.user_email)}</div>
        </td>
        <td className="audit__cell">{getModuleLabel(l.module)}</td>
        <td className="audit__cell">{getActionLabel(l.action)}</td>
        <td className="audit__cell audit__cell--right">
          <HistoriqueActions onDetails={() => openDetails(l.id)} />
        </td>
      </tr>
    );
  };

  const diffHeaders = ["Champ", "Ancien", "Nouveau"];

  const renderDiffRow = (r) => (
    <tr key={r.key} className={r.changed ? "auditDiff__row--changed" : ""}>
      <td className="auditDiff__cell auditDiff__key">{r.key}</td>
      <td className="auditDiff__cell auditDiff__mono">
        {prettyValue(r.oldValue)}
      </td>
      <td className="auditDiff__cell auditDiff__mono">
        {prettyValue(r.newValue)}
      </td>
    </tr>
  );

  const hasDiff = diffRows && diffRows.length > 0;

  return (
    <div className="audit audit--white">
      <header className="audit__header">
        <PageHeader title="Audit patient" noBorder />
      </header>

      <div className="auditContainer">
        <section className="audit__card">
          <FilterToolbar
            className="audit__row"
            items={[
              {
                type: "input",
                label: "Numéro patient",
                labelClassName: "audit__label",
                wrapperClassName: "audit__field audit__field--grow",
                className: `audit__input ${numeroError ? "input-error" : ""}`,
                value: patientNumeroInput,
                onChange: (e) => {
                  let value = e.target.value.toUpperCase();
                  value = value.replace(/[^\d-]/g, "");
                  if (value.length > 4 && !value.includes("-")) {
                    value = value.slice(0, 4) + "-" + value.slice(4);
                  }
                  setPatientNumeroInput(value);
                },
                placeholder: "Ex: 0001-2025",
                error: numeroError,
              },
            ]}
            actions={[
              <ActionButton
                key="search"
                action="add"
                label="Rechercher"
                type="button"
                onClick={onSearch}
                showIcon={false}
                disabled={!!numeroError}
              />,
              <ActionButton
                key="reset"
                action="annuler"
                label="Reset"
                type="button"
                onClick={onReset}
                variant="outline"
                showIcon={false}
              />,
            ]}
          />

          {numeroError && (
            <div
              className="audit__error-message"
              style={{ color: "red", marginTop: 4, marginLeft: 8, fontSize: "0.75rem" }}
            >
              {numeroError}
            </div>
          )}

          <FilterToolbar
            className="audit__filters"
            items={[
              {
                type: "select",
                label: "Module",
                labelClassName: "audit__label",
                wrapperClassName: "audit__field",
                className: "audit__input",
                value: module,
                onChange: (e) => {
                  setOffset(0);
                  const nextModule = e.target.value; //saisie du module
                  setModule(nextModule);
                  if (nextModule && action) {
                    const actionModule = action.split("_").slice(0, -1).join("_");
                    if (actionModule !== nextModule) setAction("");
                  }
                },
                options: [
                  { value: "", label: "Tous" },
                  ...modules.map((m) => ({ value: m, label: getModuleLabel(m) })),
                ],
              },
              {
                type: "select",
                label: "Action",
                labelClassName: "audit__label",
                wrapperClassName: "audit__field",
                className: "audit__input",
                value: action,
                onChange: (e) => {
                  setOffset(0);
                  setAction(e.target.value);
                },
                options: [
                  { value: "", label: "Toutes" },
                  ...actionsForModule.map((a) => ({ value: a, label: getActionLabel(a) })),
                ],
              },
              {
                type: "input",
                label: "Du",
                labelClassName: "audit__label",
                wrapperClassName: "audit__field",
                className: "audit__input",
                inputType: "date",
                value: from,
                onChange: (e) => { setOffset(0); setFrom(e.target.value); },
              },
              {
                type: "input",
                label: "Au",
                labelClassName: "audit__label",
                wrapperClassName: "audit__field",
                className: "audit__input",
                inputType: "date",
                value: to,
                onChange: (e) => { setOffset(0); setTo(e.target.value); },
              },
            ]}
          />
        </section>

        <div className="auditSpacer" />

        <section className="audit__card audit__card--table">
          {loading ? (
            <Spinner />
          ) : (
            <div className="auditTable">
              <HistoriqueTable
                headers={tableHeaders}
                items={logs}
                renderRow={renderLogRow}
                emptyMessage="Aucun log. Recherchez un patient."
              />
            </div>
          )}

          <div className="auditPager">
            <div className="audit__muted">
              Total: <span className="audit__strong">{total}</span> • Page {page}/{totalPages}
            </div>
            <div className="auditPager__actions">
              <ActionButton
                action="annuler"
                label="Précédent"
                type="button"
                onClick={prev}
                disabled={page <= 1}
                variant="outline"
                showIcon={false}
              />
              <ActionButton
                action="validate"
                label="Suivant"
                type="button"
                onClick={next}
                disabled={page >= totalPages}
                variant="outline"
                showIcon={false}
              />
            </div>
          </div>
        </section>

        {detailsOpen && (
          <div className="auditModal__overlay" onClick={closeDetails}>
            <div
              className="auditModal auditModal--compact"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="auditModal__header">
                <div className="auditModal__title">Détails du log</div>
                <ActionButton
                  action="annuler"
                  label="Fermer"
                  type="button"
                  onClick={closeDetails}
                  variant="outline"
                  showIcon
                />
              </div>

              <div className="auditModal__body">
                {detailsLoading ? (
                  <Spinner />
                ) : !details ? (
                  <div>Aucun détail</div>
                ) : (
                  <>
                    {/* ── Header informatif ── */}
                    <div className="auditDetail__meta">
                      <div className="auditDetail__meta-row">
                        <span className="auditDetail__meta-label">Médecin</span>
                        <span className="auditDetail__meta-value">
                          {txt(details.user_nom)} {txt(details.user_prenom)}
                          <span className="auditDetail__meta-muted">
                            {" "}— {txt(details.user_email)}
                          </span>
                        </span>
                      </div>
                      <div className="auditDetail__meta-row">
                        <span className="auditDetail__meta-label">Rôle</span>
                        <span className="auditDetail__meta-value">{txt(details.user_role)}</span>
                      </div>
                      <div className="auditDetail__meta-row">
                        <span className="auditDetail__meta-label">Date</span>
                        <span className="auditDetail__meta-value">{fmt(details.created_at)}</span>
                      </div>
                      <div className="auditDetail__meta-row">
                        <span className="auditDetail__meta-label">Module</span>
                        <span className="auditDetail__meta-value">{getModuleLabel(details.module)}</span>
                      </div>
                      <div className="auditDetail__meta-row">
                        <span className="auditDetail__meta-label">Action</span>
                        <span className="auditDetail__meta-value">{getActionLabel(details.action)}</span>
                      </div>
                      {details.patient_numero && (
                        <div className="auditDetail__meta-row">
                          <span className="auditDetail__meta-label">Patient</span>
                          <span className="auditDetail__meta-value">{details.patient_numero}</span>
                        </div>
                      )}
                      {details.ip_address && (
                        <div className="auditDetail__meta-row">
                          <span className="auditDetail__meta-label">IP</span>
                          <span className="auditDetail__meta-value auditDetail__meta-muted">{details.ip_address}</span>
                        </div>
                      )}
                    </div>

                    {/* ── Séparateur ── */}
                    <div className="auditDetail__separator" />

                    {/* ── Table diff old/new data ── */}
                    {hasDiff ? (
                      <HistoriqueTable
                        headers={diffHeaders}
                        items={diffRows}
                        renderRow={renderDiffRow}
                      />
                    ) : (
                      <div className="auditDetail__no-diff">
                        Aucune modification de données enregistrée pour cette action.
                      </div>
                    )}
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