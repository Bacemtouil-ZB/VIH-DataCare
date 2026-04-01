import {
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  SearchBar,
} from "../../../../../shared/components";
import { MESSAGES, TABLE_HEADERS }         from "./prescriptionsPharmaConstants";
import {
  resolveSuiviBadge,
  resolvePrescriptionBadge,
  isValidateDisabled,
  daysUntil,
  getRdvBarWidth,
  getDaysLabel,
} from "./PrescriptionsPharmahelpers";
import ModalDetailPrescription             from "../../../components/modal/Modaldetailprescription";
import ModalValidationPrescription         from "../../../components/modal/ModalValidationPrescription";
import { formatDateFr }                       from "../../../../../shared/utils/logiqueTableHistory";
// ── Badges ────────────────────────────────────────────────────
function SuiviBadge({ statutPatient, ecartJours }) {
  const { badgeClass, badgeText, showEcart } = resolveSuiviBadge(statutPatient, ecartJours);
  return (
    <div className="statut-wrapper">
      <span className={`statut-badge ${badgeClass}`}>{badgeText}</span>
      {showEcart && <span className="ecart-badge">+{ecartJours}j</span>}
    </div>
  );
}

function PrescriptionBadge({ statutPrescription }) {
  const { badgeClass, badgeText } = resolvePrescriptionBadge(statutPrescription);
  return <span className={`statut-badge ${badgeClass}`}>{badgeText}</span>;
}

// ── RdvCell ───────────────────────────────────────────────────
function RdvCell({ rdv }) {
  if (!rdv?.date) {
    return <span className="badge rdv-none">Aucun RDV</span>;
  }
  const days    = daysUntil(rdv.date);
  const label   = getDaysLabel(days);
  const bar     = getRdvBarWidth(days);
  const rdvDate = new Date(rdv.date).toLocaleDateString("fr-FR");

  return (
    <div className="rdv-bar-cell">
      <div className="rdv-bar-top">
        <span className="rdv-bar-date">{rdvDate}</span>
        <span className={`rdv-bar-days rdv-days-${bar.cls}`}>{label}</span>
      </div>
      <div className="rdv-bar-track">
        <div className={`rdv-bar-fill rdv-fill-${bar.cls}`} style={{ width: `${bar.width}%` }} />
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────
export default function PrescriptionsUI({
  search,
  showHistory,
  filtered,
  detailItem,
  validationItem,
  savingValidation,
  setSearch,
  setShowHistory,
  openDetail,
  closeDetail,
  openValidation,
  closeValidation,
  handleValidate,
}) {
  return (
    <div className="prescriptions-page-container">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="prescriptions-header">
        <h2 className="page-title">
          {MESSAGES.titrePage} ({filtered.length})
        </h2>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label=""
          placeholder="Rechercher par nom, prenom ou traitement"
          wrapperClassName="prescription-search"
          inputClassName="search-input"
        />
      </div>

      {/* ── Tableau ───────────────────────────────────────── */}
      <HistoriqueAccordeon
        title=""
        count={filtered.length}
        showCount={false}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
        hideTitle
        contentClassName="prescription-acc-body"
      >
        <HistoriqueTable
          headers={TABLE_HEADERS}
          items={filtered}
          emptyMessage={search ? MESSAGES.aucunResultat : MESSAGES.aucunePrescription}
          renderRow={(p) => (
            <tr key={p.prescriptionId || `${p.numeroDossier}-${p.nomTraitement}`}>
             <td className="td-date">
                {p.dateNaissance
                  ? new Date(p.dateNaissance).toLocaleDateString("fr-FR")
                  : "-"}
              </td>
              <td className="td-patient">
                {`${p.patientSurname} ${p.patientName}`.trim()}
              </td>
              <td className="td-traitement">{p.nomTraitement}</td>
              <td className="td-date">
                {p.dateProchainePrise ? (
                  <span className={p.ecartJours > 0 ? "date-retard" : "date-future"}>
                    {formatDateFr(p.dateProchainePrise, "-")}
                  </span>
                ) : "-"}
              </td>
              <td className="td-quantite">{p.quantitePrescrite}</td>
              <td className="td-statut">
                <PrescriptionBadge statutPrescription={p.statutPrescription} />
              </td>
              <td className="td-statut">
                <SuiviBadge statutPatient={p.statutPatient} ecartJours={p.ecartJours} />
              </td>
              <td className="td-rdv">
                <RdvCell rdv={p.rdv} />
              </td>
              <td className="td-action">
                <HistoriqueActions
                  onDetails={() => openDetail(p)}
                  onValidate={() => openValidation(p)}
                  validateProps={{ disabled: isValidateDisabled(p.statutPrescription) }}
                />
              </td>
            </tr>
          )}
        />
      </HistoriqueAccordeon>

      {/* ── Modales ───────────────────────────────────────── */}
      <ModalDetailPrescription item={detailItem} onClose={closeDetail} />
      <ModalValidationPrescription
        item={validationItem}
        saving={savingValidation}
        onClose={closeValidation}
        onConfirm={handleValidate}
      />
    </div>
  );
}