// ── ResultatsBiologiquesUI.jsx ────────────────────────────────────────────────
// Rendu pur — zéro logique métier
import {
  ActionButton, Badge, FieldLabel, FormulaireWrapper,
  HistoriqueAccordeon, HistoriqueActions, HistoriqueTable,
  Input, Spinner,
} from "../../../../../shared/components/index";
import Textarea from "../../../components/UI/Textarea";
import PageTitle from "../../../components/UI/PageTitle";

// ── Mapping clé de section → colonne date dans la DB ─────────────────────────
const SECTION_DATE_KEY = {
  serologie_vih:          "date_serologie_vih",
  bilan_biochimique:      "date_bilan_biochimique",
  serologie_vhb:          "date_serologie_vhb",
  nfs_complete:           "date_nfs_complete",
  charge_virale_vih:      "date_charge_virale_vih",
  cd4_cd8:                "date_cd4_cd8",
  bilan_lipidique:        "date_bilan_lipidique",
  serologie_vha:          "date_serologie_vha",
  serologie_vhc:          "date_serologie_vhc",
  serologie_syphilis:     "date_serologie_syphilis",
  serologie_toxoplasmose: "date_serologie_toxoplasmose",
  serologie_cmv:          "date_serologie_cmv",
  serologie_leishmaniose: "date_serologie_leishmaniose",
  idr_tuberculine:        "date_idr_tuberculine",
  radio_thorax:           "date_radio_thorax",
};

// ── Rendu d'un champ selon son type ──────────────────────────────────────────
function ChampResultat({ champ, value, onChange, disabled }) {
  const { label, type, unite, options, key } = champ;

  const isWide = type === "textarea";

  const renderInput = () => {
    if (type === "select") {
      return (
        <select
          className="form-select"
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">— Sélectionner —</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (type === "textarea") {
      return (
        <Textarea
          value={value}
          onChange={onChange}
          placeholder={label}
          disabled={disabled}
        />
      );
    }
    // number ou text
    return (
      <div className="rb-input-unit">
        <Input
          type={type}
          className="form-control"
          value={value}
          onChange={onChange}
          placeholder="—"
          disabled={disabled}
        />
        {unite && <span className="rb-unite">{unite}</span>}
      </div>
    );
  };

  return (
    <div className={`rb-champ${isWide ? " rb-champ-wide" : ""}`}>
      <label>{label}</label>
      {renderInput()}
    </div>
  );
}

// ── Section avec titre + date inline + grille de champs ──────────────────────
function SectionBilan({ section, sectionKey, formData, field, disabled }) {
  const dateKey = SECTION_DATE_KEY[sectionKey];

  return (
    <div className="rb-section">
      {/* ── En-tête : titre à gauche, date à droite ── */}
      <div className="rb-section-header">
        <div className="rb-section-title">
          <i className="bi bi-flask me-2" />
          {section.label}
        </div>
        {dateKey && (
          <div className="rb-section-date">
            <label htmlFor={`date-${sectionKey}`}>Date :</label>
            <input
              id={`date-${sectionKey}`}
              type="date"
              value={formData[dateKey] || ""}
              onChange={field(dateKey)}
              disabled={disabled}
            />
          </div>
        )}
      </div>

      {/* ── Grille 3 colonnes ── */}
      <div className="rb-champs-grid">
        {section.champs.map((champ) => (
          <ChampResultat
            key={champ.key}
            champ={champ}
            value={formData[champ.key] ?? ""}
            onChange={field(champ.key)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

// ── Résumé pour le tableau historique ────────────────────────────────────────
function ResultatResume({ resultat, champsActifs }) {
  const filled = champsActifs
    .flatMap((s) => s.champs)
    .filter(({ key }) => resultat[key] !== null && resultat[key] !== undefined && resultat[key] !== "")
    .length;
  const total = champsActifs.flatMap((s) => s.champs).length;
  return (
    <Badge bg="#e0f2fe" color="#075985">
      {filled}/{total} champs renseignés
    </Badge>
  );
}

// ── Composant principal UI ────────────────────────────────────────────────────
export default function ResultatsBiologiquesUI({
  bilanPrescrit, champsActifs,
  resultats, loading, saving,
  showForm, showHistory, setShowHistory,
  isModifying, detailItem, setDetailItem,
  formData, field,
  openCreate, openEdit, closeForm, handleShowDetails, handleSubmit,
}) {
  const noBilan = !bilanPrescrit;
  const noChamps = champsActifs.length === 0;

  // Reconstruit la liste des sections avec leur clé d'origine pour le date mapping
  const sectionsWithKey = champsActifs.map((section) => ({
    ...section,
    sectionKey: Object.keys(SECTION_DATE_KEY).find(
      (k) => SECTION_DATE_KEY[k] && section.label &&
        // correspondance par le label ou par la clé directe passée depuis bilanResultatsMap
        section._key === k
    ) || section._key || "",
  }));

  return (
    <div className="ec-page-bg rb-page">
      <PageTitle title="Résultats biologiques" />

      {/* ── Alerte si aucun bilan prescrit ─────────────────────────────────── */}
      {noBilan && !loading && (
        <div className="rb-alert-no-bilan">
          <i className="bi bi-info-circle me-2" />
          Aucun bilan prescrit pour ce patient. Veuillez d'abord créer une
          prescription de bilans.
        </div>
      )}

      {/* ── Toolbar : bouton à l'extrémité droite ───────────────────────────── */}
      {!noBilan && (
        <div className="rb-toolbar">
          {!showForm ? (
            <ActionButton
              action="add" label="Saisir les résultats"
              size="sm" onClick={openCreate}
            />
          ) : (
            <ActionButton
              action="annuler" label="Annuler"
              size="sm" onClick={() => closeForm()}
            />
          )}
        </div>
      )}

      {/* ── Formulaire ───────────────────────────────────────────────────────── */}
      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Saisie des résultats biologiques"
          labelModify="Modifier les résultats biologiques"
        >
          <form onSubmit={handleSubmit}>

            {/* Sections de champs — générées dynamiquement depuis champsActifs */}
            {noChamps ? (
              <p className="text-muted text-center py-3">
                Aucun bilan actif dans la prescription.
              </p>
            ) : (
              champsActifs.map((section) => (
                <SectionBilan
                  key={section.label}
                  section={section}
                  sectionKey={section._key || ""}
                  formData={formData}
                  field={field}
                  disabled={saving}
                />
              ))
            )}

            {/* Observations globales */}
            <div className="rb-observations">
              <FieldLabel>Observations générales</FieldLabel>
              <Textarea
                value={formData.observations || ""}
                onChange={field("observations")}
                placeholder="Observations, commentaires du laboratoire..."
                disabled={saving}
              />
            </div>

            <div className="rb-form-actions">
              <ActionButton
                action="save"
                label={isModifying ? "Mettre à jour" : "Enregistrer"}
                showIcon={false} size="sm" block
                loading={saving} loadingLabel="Enregistrement..."
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      {/* ── Historique ───────────────────────────────────────────────────────── */}
      <HistoriqueAccordeon
        title="Historique des résultats biologiques"
        count={resultats.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ? (
          <Spinner />
        ) : (
          <HistoriqueTable
            headers={["Date", "Résultats", "Observations", "Action"]}
            items={resultats}
            emptyMessage="Aucun résultat biologique enregistré."
            renderRow={(r) => (
              <tr key={r.id}>
                <td>
                  {new Date(r.date_resultat || r.created_at)
                    .toLocaleDateString("fr-FR")}
                </td>
                <td>
                  <ResultatResume resultat={r} champsActifs={champsActifs} />
                </td>
                <td className="rb-obs-cell">
                  {r.observations || <span className="text-muted">—</span>}
                </td>
                <td>
                  <HistoriqueActions
                    onDetails={() => handleShowDetails(r)}
                    onEdit={() => openEdit(r)}
                  />
                </td>
              </tr>
            )}
          />
        )}
      </HistoriqueAccordeon>

      {/* ── Vue Détail ───────────────────────────────────────────────────────── */}
      {detailItem && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Détails des résultats biologiques"
          labelModify="Détails des résultats biologiques"
        >
          <div className="ec-readonly-block">
            <div className="rb-date-row">
              <FieldLabel>Date du résultat</FieldLabel>
              <Input
                type="text"
                className="form-control"
                value={new Date(detailItem.date_resultat || detailItem.created_at)
                  .toLocaleDateString("fr-FR")}
                disabled readOnly
              />
            </div>

            {champsActifs.map((section) => (
              <SectionBilan
                key={section.label}
                section={section}
                sectionKey={section._key || ""}
                formData={detailItem}
                field={() => () => {}}
                disabled
              />
            ))}

            {detailItem.observations && (
              <div className="rb-observations">
                <FieldLabel>Observations</FieldLabel>
                <Textarea value={detailItem.observations} disabled />
              </div>
            )}

            <div className="rb-form-actions">
              <ActionButton
                action="annuler" label="Fermer" size="sm"
                onClick={() => setDetailItem(null)}
              />
            </div>
          </div>
        </FormulaireWrapper>
      )}
    </div>
  );
}