import {
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  SearchBar,
  Badge,
} from "../../../../../shared/components";
import {
  MESSAGES,
  TABLE_HEADERS,
  BADGE_COLORS,
} from "./prescriptionsPharmaConstants";
import {
  resolveSuiviBadge,
  resolvePrescriptionBadge,
  isValidateDisabled,
  isModifyDisabled,
} from "./PrescriptionsPharmahelpers";
import ModalDetailPrescription     from "../../../components/modal/Modaldetailprescription";
import ModalValidationPrescription from "../../../components/modal/ModalValidationPrescription";
import ModalModifierPeriode        from "../../../components/modal/ModalModifierPeriode";
import { formatDateFr }            from "../../../../../shared/utils/logiqueTableHistory";

const resolvePalette = (key) => BADGE_COLORS[key] ?? BADGE_COLORS.en_attente;

// ── Statut patient badge ──────────────────────────────────────
function StatutPatientBadge({ statutPatient, dateEcart }) {
  const { badgeText, showEcart } = resolveSuiviBadge(statutPatient, dateEcart);
  const palette = resolvePalette(statutPatient);
  return (
    <div className="statut-wrapper">
      <Badge bg={palette.bg} color={palette.color}>{badgeText}</Badge>
      {showEcart && (
        <span className="ecart-badge">+{dateEcart}j de retard</span>
      )}
    </div>
  );
}

// ── Prescription badge ────────────────────────────────────────
function PrescriptionBadge({ statutPrescription }) {
  const { badgeText } = resolvePrescriptionBadge(statutPrescription);
  const key     = (statutPrescription || "envoyee").toLowerCase();
  const palette = resolvePalette(key);
  return <Badge bg={palette.bg} color={palette.color}>{badgeText}</Badge>;
}

// ── Colonne fusionnée : Prescription + Statut patient ─────────
function StatutCell({ statutPrescription, suiviStatutPatient, dateEcart }) {
  return (
    <div className="statut-cell">
      <PrescriptionBadge statutPrescription={statutPrescription} />
      <StatutPatientBadge
        statutPatient={suiviStatutPatient || "actif"}
        dateEcart={dateEcart}
      />
    </div>
  );
}

// ── Colonne fusionnée : Date prochaine prise + écart ──────────
function PriseDateCell({ dateProchainePrise, dateEcart }) {
  if (!dateProchainePrise) return <span className="td-empty">—</span>;
  const enRetard = dateEcart > 2;
  return (
    <div className="prise-cell">
      <span className={enRetard ? "date-retard" : "date-future"}>
        {formatDateFr(dateProchainePrise, "—")}
      </span>
      {enRetard && (
        <span className="ecart-badge">+{dateEcart}j</span>
      )}
    </div>
  );
}

// ── RDV cell ──────────────────────────────────────────────────
function RdvCell({ rdv }) {
  if (!rdv?.date) {
    return <span className="rdv-none">Aucun RDV</span>;
  }
  return <span className="rdv-date">{formatDateFr(rdv.date, "—")}</span>;
}

// ── Action buttons ────────────────────────────────────────────
function ActionButtons({ p, openDetail, openValidation, openModification, activeAction }) {
  const validateBlocked = isValidateDisabled(p.statutPrescription) || activeAction === "modify";
  const modifyBlocked   = isModifyDisabled(p.statutPrescription)   || activeAction === "validate";
  return (
    <HistoriqueActions
      onDetails={() => openDetail(p)}
      onValidate={() => openValidation(p)}
      validateProps={{
        disabled: validateBlocked,
        title: validateBlocked ? "Action non disponible" : undefined,
      }}
      onEdit={
        typeof openModification === "function" && !modifyBlocked
          ? () => openModification(p)
          : undefined
      }
      editProps={{
        disabled: modifyBlocked,
        title: modifyBlocked ? "Action non disponible" : undefined,
      }}
    />
  );
}

// ── Composant principal ───────────────────────────────────────
export default function PrescriptionsUI({
  search,
  showHistory,
  filtered,
  detailItem,
  validationItem,
  modificationItem,
  savingValidation,
  setSearch,
  setShowHistory,
  openDetail,
  closeDetail,
  openValidation,
  closeValidation,
  openModification,
  closeModification,
  handleValidate,
  handleValidateAvecModification,
}) {
  const activeAction = validationItem ? "validate" : modificationItem ? "modify" : null;

  return (
    <div className="prescriptions-page-container">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="prescriptions-header">
        <h2 className="page-title">
          {MESSAGES.titrePage} ({filtered.length})
        </h2>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, prénom ou traitement"
          wrapperClassName="prescription-search"
          inputClassName="search-input"
        />
      </div>

      {/* ── Tableau ─────────────────────────────────────────── */}
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
            <tr key={p.prescriptionId}>

              {/* Date naissance */}
              <td className="col-date">
                {p.dateNaissance
                  ? `- ${new Date(p.dateNaissance).toLocaleDateString("fr-FR")}`
                  : "—"}
              </td>

              {/* Patient */}
              <td className="col-patient">
                <span className="patient-nom">
                  {`${p.patientSurname} ${p.patientName}`.trim()}
                </span>
                <span className="patient-dossier">{p.numeroDossier}</span>
              </td>

              {/* Traitement */}
              <td className="col-traitement">{p.nomTraitement}</td>

              {/* Prochaine prise + écart */}
              <td className="col-prise">
                <PriseDateCell
                  dateProchainePrise={p.dateProchainePrise}
                  dateEcart={p.dateEcart}
                />
              </td>

              {/* Prescription + Statut patient — fusionnés */}
              <td className="col-statut">
                <StatutCell
                  statutPrescription={p.statutPrescription}
                  suiviStatutPatient={p.suiviStatutPatient}
                  dateEcart={p.dateEcart}
                />
              </td>

              {/* RDV */}
              <td className="col-rdv">
                <RdvCell rdv={p.rdv} />
              </td>

              {/* Action */}
              <td className="col-action">
                <ActionButtons
                  p={p}
                  openDetail={openDetail}
                  openValidation={openValidation}
                  openModification={openModification}
                  activeAction={activeAction}
                />
              </td>
            </tr>
          )}
        />
      </HistoriqueAccordeon>

      {/* ── Modales ─────────────────────────────────────────── */}
      <ModalDetailPrescription item={detailItem} onClose={closeDetail} />
      <ModalValidationPrescription
        item={validationItem}
        saving={savingValidation}
        onClose={closeValidation}
        onConfirm={handleValidate}
      />
      <ModalModifierPeriode
        item={modificationItem}
        saving={savingValidation}
        onClose={closeModification}
        onConfirm={handleValidateAvecModification}
      />
    </div>
  );
}