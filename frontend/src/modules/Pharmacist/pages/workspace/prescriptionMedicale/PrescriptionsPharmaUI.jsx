import {
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  SearchBar,
  Badge
} from "../../../../../shared/components";
import { MESSAGES, TABLE_HEADERS }         from "./prescriptionsPharmaConstants";
import {
  resolveSuiviBadge,
  resolvePrescriptionBadge,
  isValidateDisabled,
  isModifyDisabled,
  daysUntil,
  getRdvBarWidth,
  getDaysLabel,
} from "./PrescriptionsPharmahelpers";
import ModalDetailPrescription             from "../../../components/modal/Modaldetailprescription";
import ModalValidationPrescription         from "../../../components/modal/ModalValidationPrescription";
import ModalModifierPeriode                from "../../../components/modal/ModalModifierPeriode";
import { formatDateFr }                    from "../../../../../shared/utils/logiqueTableHistory";

// ── Palette de couleurs centralisée ──────────────────────────
// Couvre les 5 statuts SQL retournés par le modèle
const BADGE_COLORS = {
  // Statut prescription
  delivree:  { bg: "#dcfce7", color: "#166534" },
  modifie:   { bg: "#ffedd5", color: "#9a3412" },
  envoyee:   { bg: "#fef9c3", color: "#854d0e" },
  // Statut suivi thérapeutique
  actif:     { bg: "#dbeafe", color: "#1e40af" },
  attente:   { bg: "#f1f5f9", color: "#475569" },
  retard:    { bg: "#fff7ed", color: "#c2410c" },   // "en retard"
  perdu:     { bg: "#fee2e2", color: "#991b1b" },   // "perdue de vue"
  recupere:  { bg: "#f0fdf4", color: "#15803d" },   // "récupéré perdue de vue"
};

// ── Résolution de la palette suivi à partir du statut ────────
const resolveSuiviPalette = (statutPatient) => {
  const key = (statutPatient || "").toLowerCase().trim();
  if (key.includes("récupéré") || key.includes("recupere")) return BADGE_COLORS.recupere;
  if (key.includes("perdue") || key.includes("perdu"))       return BADGE_COLORS.perdu;
  if (key.includes("retard"))                                 return BADGE_COLORS.retard;
  if (key.includes("attente"))                                return BADGE_COLORS.attente;
  return BADGE_COLORS.actif;
};

// ── SuiviBadge ───────────────────────────────────────────────
function SuiviBadge({ statutPatient, ecartJours }) {
  const { badgeText, showEcart } = resolveSuiviBadge(statutPatient, ecartJours);
  const palette = resolveSuiviPalette(statutPatient);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-start" }}>
      <Badge bg={palette.bg} color={palette.color}>{badgeText}</Badge>
      {showEcart && (
        <Badge bg="#fef2f2" color="#dc2626">+{ecartJours}j</Badge>
      )}
    </div>
  );
}

// ── PrescriptionBadge ─────────────────────────────────────────
function PrescriptionBadge({ statutPrescription }) {
  const { badgeText } = resolvePrescriptionBadge(statutPrescription);
  const key     = (statutPrescription || "envoyee").toLowerCase();
  const palette = BADGE_COLORS[key] ?? BADGE_COLORS.envoyee;

  return <Badge bg={palette.bg} color={palette.color}>{badgeText}</Badge>;
}

// ── RdvCell ───────────────────────────────────────────────────
function RdvCell({ rdv }) {
  if (!rdv?.date) {
    return <Badge bg="#f8fafc" color="#94a3b8">Aucun RDV</Badge>;
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

// ── ActionButtons ─────────────────────────────────────────────
function ActionButtons({ p, openDetail, openValidation, openModification, activeAction }) {
  const statut = p.statutPrescription;

  const validateBlocked = isValidateDisabled(statut) || activeAction === "modify";
  const modifyBlocked   = isModifyDisabled(statut)   || activeAction === "validate";

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
  const activeAction = validationItem
    ? "validate"
    : modificationItem
      ? "modify"
      : null;

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
          placeholder="Rechercher par nom, prénom ou traitement"
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

              {/* Date naissance */}
              <td className="td-date">
                {p.dateNaissance
                  ? new Date(p.dateNaissance).toLocaleDateString("fr-FR")
                  : "-"}
              </td>

              {/* Patient */}
              <td className="td-patient">
                {`${p.patientSurname} ${p.patientName}`.trim()}
              </td>

              {/* Traitement */}
              <td className="td-traitement">{p.nomTraitement}</td>

              {/* Date prochaine prise */}
              <td className="td-date">
                {p.dateProchainePrise ? (
                  <span className={p.ecartJours > 0 ? "date-retard" : "date-future"}>
                    {formatDateFr(p.dateProchainePrise, "-")}
                  </span>
                ) : "-"}
              </td>

              {/* Statut prescription */}
              <td className="td-statut">
                <PrescriptionBadge statutPrescription={p.statutPrescription} />
              </td>

              {/* Suivi thérapeutique */}
              <td className="td-statut">
                <SuiviBadge statutPatient={p.statutPatient} ecartJours={p.ecartJours} />
              </td>

              {/* RDV */}
              <td className="td-rdv">
                <RdvCell rdv={p.rdv} />
              </td>

              {/* Action */}
              <td className="td-action">
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

      {/* ── Modales ───────────────────────────────────────── */}
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