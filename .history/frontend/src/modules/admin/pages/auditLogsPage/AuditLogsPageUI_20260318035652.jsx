import { fmt, prettyValue, txt } from "./helpers";
import PageHeader from "../../components/PageHeader";
import { ActionButton, FilterToolbar, HistoriqueActions,HistoriqueTable,Spinner} from "../../../../shared/components/index";

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

  // Définir une erreur si le numéro patient n'est pas vide et ne correspond pas au format attendu
  const numeroError =
    patientNumeroInput &&
    !/^\d{4}-\d{4}$/.test(patientNumeroInput)
      ? "Format invalide (ex: 0001-2025)"
      : "";

  const renderLogRow = (l) => (
    <tr key={l.id}>
      <td className="audit__cell">{fmt(l.created_at)}</td>
      <td className="audit__cell">
        <div className="audit__strong">{txt(l.user_nom)} {txt(l.user_prenom)}</div>
        <div className="audit__muted">{txt(l.user_email)}</div>
      </td>
      <td className="audit__cell">{txt(l.module)}</td>
      <td className="audit__cell">{txt(l.action)}</td>
      <td className="audit__cell audit__cell--right">
        <HistoriqueActions onDetails={() => openDetails(l.id)} />
      </td>
    </tr>
  );

  const diffHeaders = ["Champ", "Ancien", "Nouveau"];

  const renderDiffRow = (r) => (
    <tr key={r.key} className={r.changed ? "auditDiff__row--changed" : ""}>
      <td className="auditDiff__cell auditDiff__key">{r.key}</td>
      <td className="auditDiff__cell auditDiff__mono">{prettyValue(r.oldValue)}</td>
      <td className="auditDiff__cell auditDiff__mono">{prettyValue(r.newValue)}</td>
    </tr>
  );

  return (
    <div className="audit audit--white">
      <header className="audit__header">
        <PageHeader
          title="Audit patient" 
          noBorder
        />
      </header>

      <div className="auditContainer">
        <section className="audit__card">
         <FilterToolbar
            as="form"
            className="audit__row"
            onSubmit={onSearch}
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

                  // supprimer tout sauf chiffres et "-"
                  value = value.replace(/[^\d-]/g, "");

                  // auto format 0001-2025
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
                type="submit"
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
          <div className="audit__error-message" style={{ color: "red", marginTop: 4, marginLeft: 8 }}>
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
                  const nextModule = e.target.value;
                  setModule(nextModule);
                  if (nextModule && action) {
                    const actionModule = action.split("_").slice(0, -1).join("_");
                    if (actionModule !== nextModule) setAction("");
                  }
                },
                options: [
                  { value: "", label: "Tous" },
                  ...modules.map((m) => ({ value: m, label: m })),
                ],
              },
              {
                type: "select",
                label: "Action",
                labelClassName: "audit__label",
                wrapperClassName: "audit__field",
                className: "audit__input",
                value: action,
                onChange: (e) => { setOffset(0); setAction(e.target.value); },
                options: [
                  { value: "", label: "Toutes" },
                  ...actionsForModule.map((a) => ({ value: a, label: a })),
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
                  <ActionButton
                    action="annuler"
                    label="Fermer"
                    type="button"
                    onClick={closeDetails}
                    variant="outline"
                    showIcon={true}
                  />
                </div>
              </div>

              <div className="auditModal__body auditModal__body--scroll">
                {detailsLoading ? (
                  <Spinner />
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
                      <HistoriqueTable
                        headers={diffHeaders}
                        items={diffRows}
                        renderRow={renderDiffRow}
                        emptyMessage="Aucune donnée à comparer."
                      />
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
