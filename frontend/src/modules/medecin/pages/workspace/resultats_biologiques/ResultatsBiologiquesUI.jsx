import { forwardRef } from "react";
import Textarea  from "../../../components/UI/Textarea";
import PageTitle from "../../../components/UI/PageTitle";
import {
  ActionButton,
  FieldError,
  FieldLabel,
  FormulaireWrapper,
  HistoriqueAccordeon,
  HistoriqueTable,
  Input,
  Spinner,
} from "../../../../../shared/components/index";
import {
  SECTION_DATE_KEY,
  BILAN_HISTORIQUE_HEADERS,
  RADIO_OPTIONS_3,
  MESSAGES,
} from "./ResultatsbiologiquesConstants";
import { formatBilanSummary } from "../prescreption_dexamens/Bilanexamenhelpers";
import {
  normalizeGenotypageUrls,
  formatDate,
} from "./resultatsBiologiquesHelpers";

// ── Champ unique selon son type ───────────────────────────────────────────────
// type "select" → 3 radio natifs inline : Négatif · Positif · NF
function ChampResultat({ champ, value, onChange, disabled, error }) {
  const { label, type, unite, key } = champ;
  const isWide = type === "textarea";

  const renderInput = () => {
    if (type === "select") {
      return (
        <div className="rb-radio-group">
          {RADIO_OPTIONS_3.map((opt) => (
            <label key={opt.value} className="rb-radio-item">
              <input
                type="radio"
                name={key}
                value={opt.value}
                checked={value === opt.value}
                onChange={onChange}
                disabled={disabled}
                className="rb-radio-input"
              />
              <span className="rb-radio-label">{opt.label}</span>
            </label>
          ))}
        </div>
      );
    }
    if (type === "textarea") {
      return (
        <Textarea value={value} onChange={onChange} placeholder={label} disabled={disabled} />
      );
    }
    return (
      <div className="rb-input-unit">
        <Input
          type={type}
          className={`form-control ${error ? "is-invalid" : ""}`}
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
      {error && <FieldError error={error} />}
    </div>
  );
}

// ── Section bilan : en-tête (titre + date) + grille de champs ────────────────
// En mode disabled (détail) la date est affichée en texte lisible fr-FR.
const SectionBilan = forwardRef((
  { section, sectionKey, formData, field, disabled, errors, onChooseGenotypageFile },
  ref
) => {
  const dateKey = SECTION_DATE_KEY[sectionKey];

  return (
    <div className="rb-section" data-section={sectionKey} ref={ref}>
      <div className="rb-section-header">
        <div className="rb-section-title">
          <i className="bi bi-flask me-2" />
          {section.label}
        </div>
        {dateKey && (
          <div className="rb-section-date">
            <label htmlFor={`date-${sectionKey}`}>
              Date : <span style={{ color: "#dc2626" }}>*</span>
            </label>
            {disabled ? (
              <span className="rb-date-readonly">{formatDate(formData[dateKey])}</span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <input
                  id={`date-${sectionKey}`}
                  type="date"
                  value={formData[dateKey] || ""}
                  onChange={field(dateKey)}
                  max={new Date().toISOString().slice(0, 10)}
                  required
                  className={errors[dateKey] ? "is-invalid" : ""}
                  style={{ height: 38 }}
                />
                {errors[dateKey] && <FieldError error={errors[dateKey]} />}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rb-champs-grid">
        {section.champs.map((champ) => {
          // Champ fichier génotypage : bouton choisir fichier (saisie uniquement)
          if (champ.type === "file") {
            const currentUrls = normalizeGenotypageUrls(formData[champ.key]);
            const hasFile = currentUrls.length > 0;
            return (
              <div key={champ.key} className="rb-champ rb-champ-wide">
                <label>{champ.label}</label>
                <div className="d-flex gap-2 align-items-center">
                  {!disabled && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={onChooseGenotypageFile}
                    >
                      Choisir fichier(s)
                    </button>
                  )}
                  {hasFile && (
                    <span className="text-muted" style={{ fontSize: 12 }}>
                      {currentUrls.length} fichier(s)
                    </span>
                  )}
                </div>
              </div>
            );
          }

          return (
            <ChampResultat
              key={champ.key}
              champ={champ}
              value={formData[champ.key] ?? ""}
              onChange={field(champ.key)}
              disabled={disabled}
              error={errors[champ.key]}
            />
          );
        })}
      </div>
    </div>
  );
});

SectionBilan.displayName = "SectionBilan";

// ── Actions par ligne de bilan ────────────────────────────────────────────────
function BilanRowActions({ bilan, resultat, onSaisir, onModifier, onDetail }) {
  if (!resultat) {
    return (
      <ActionButton
        action="add"
        label="Saisir résultat"
        size="sm"
        variant="outline"
        onClick={() => onSaisir(bilan)}
      />
    );
  }
  return (
    <div className="d-flex gap-2">
      <ActionButton
        action="edit"
        label="Modifier résultat"
        size="sm"
        variant="outline"
        onClick={() => onModifier(resultat, bilan)}
      />
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={() => onDetail(resultat, bilan)}
      >
        Détail
      </button>
    </div>
  );
}

// ── Composant principal UI ────────────────────────────────────────────────────
// Rendu pur — zéro logique métier, zéro appel API, zéro état.
export default function ResultatsBiologiquesUI({
  bilans,
  champsActifs,
  loading, saving,
  showForm, showHistory, setShowHistory,
  isModifying, detailItem, setDetailItem,
  formData, field,
  errors,
  getResultatForBilan,
  openCreateForBilan,
  openEdit,
  closeForm,
  handleShowDetails,
  handleSubmit,
  // génotypage — logique et état gérés dans useResultatsBiologiquesLogic
  fileInputRef,
  genotypageSectionRef,
  openGenotypagePage,
  openGenotypagePicker,
  handleGenotypageFileChange,
}) {
  const noChamps = champsActifs.length === 0;

  return (
    <div className="ec-page-bg rb-page">

      {/* ── Titre + bouton Consulter génotypage (extrémité droite) ──────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <PageTitle title="Résultats biologiques" />
        <button
          type="button"
          className="btn btn-sm btn-outline-success"
          onClick={openGenotypagePage}
        >
          <i className="bi bi-eye me-1" />
          Consulter génotypage
        </button>
      </div>

      {/* Input fichier caché — déclenché via openGenotypagePicker depuis le hook */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        style={{ display: "none" }}
        onChange={handleGenotypageFileChange}
      />

      {/* ── Toolbar Annuler (visible uniquement si formulaire ouvert) ───────── */}
      {showForm && (
        <div className="rb-toolbar">
          <ActionButton action="annuler" label="Annuler" size="sm" onClick={closeForm} />
        </div>
      )}

      {/* ── Formulaire saisie / modification ────────────────────────────────── */}
      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Saisie des résultats biologiques"
          labelModify="Modifier les résultats biologiques"
        >
          <form onSubmit={handleSubmit}>
            {noChamps ? (
              <p className="text-muted text-center py-3">{MESSAGES.aucunBilanActif}</p>
            ) : (
              champsActifs.map((section) => (
                <SectionBilan
                  key={section._key}
                  section={section}
                  sectionKey={section._key || ""}
                  formData={formData}
                  field={field}
                  disabled={saving}
                  errors={errors}
                  onChooseGenotypageFile={openGenotypagePicker}
                  ref={section._key === "test_genotypage" ? genotypageSectionRef : null}
                />
              ))
            )}

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
                loading={saving} loadingLabel={MESSAGES.enregistrement}
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      {/* ── Historique des bilans prescrits ─────────────────────────────────── */}
      <HistoriqueAccordeon
        title="Historique des bilans prescrits"
        count={bilans.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ? (
          <Spinner />
        ) : (
          <HistoriqueTable
            headers={BILAN_HISTORIQUE_HEADERS}
            items={bilans}
            emptyMessage={MESSAGES.aucunBilanPrescrit}
            renderRow={(bilan) => {
              const resultat = getResultatForBilan(bilan);
              return (
                <tr key={bilan.id}>
                  <td>{new Date(bilan.created_at).toLocaleDateString("fr-FR")}</td>
                  <td><span className="bilan-summary">{formatBilanSummary(bilan)}</span></td>
                  <td className="rb-obs-cell">
                    {bilan.observations || <span className="text-muted">—</span>}
                  </td>
                  <td>
                    <BilanRowActions
                      bilan={bilan}
                      resultat={resultat}
                      onSaisir={openCreateForBilan}
                      onModifier={openEdit}
                      onDetail={handleShowDetails}
                    />
                  </td>
                </tr>
              );
            }}
          />
        )}
      </HistoriqueAccordeon>

      {/* ── Vue Détail résultat (lecture seule) ─────────────────────────────── */}
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
                value={formatDate(detailItem.date_resultat || detailItem.created_at)}
                disabled
                readOnly
              />
            </div>

            {champsActifs.map((section) => (
              <SectionBilan
                key={section._key}
                section={section}
                sectionKey={section._key || ""}
                formData={detailItem}
                field={() => () => {}}
                disabled
                errors={{}}
                onChooseGenotypageFile={() => {}}
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