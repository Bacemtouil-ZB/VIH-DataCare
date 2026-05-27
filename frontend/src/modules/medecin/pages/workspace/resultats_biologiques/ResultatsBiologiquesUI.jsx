
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
  getTodayLocalISO,
  toDateInputValue,
} from "./resultatsBiologiquesHelpers";

// ─────────────────────────────────────────────────────────────────────────────
// CHAMP RÉSULTAT
// Rendu d'un champ selon son type : radio 3 états, textarea, ou input numérique.
// ─────────────────────────────────────────────────────────────────────────────
function ChampResultat({ champ, value, onChange, disabled, error }) {
  const { label, type, unite, key } = champ;
  const isWide = type === "textarea";
  const isNumeric = type === "number";

  const handleNumericChange = (e) => {
    const nextValue = e.target.value;

    if (nextValue === "" || /^\d*([.,]\d*)?$/.test(nextValue)) {
      onChange({ target: { value: nextValue } });
    }
  };

  const renderInput = () => {
    // // Type "select" → 3 boutons radio inline : Négatif · Positif · NF
    // if (type === "select") {
    //   return (
    //     <div className="rb-radio-group">
    //       {RADIO_OPTIONS_3.map((opt) => (
    //         <label key={opt.value} className="rb-radio-item">
    //           <input
    //             type="radio"
    //             name={key}
    //             value={opt.value}
    //             checked={value === opt.value}
    //             onChange={onChange}
    //             disabled={disabled}
    //             className="rb-radio-input"
    //           />
    //           <span className="rb-radio-label">{opt.label}</span>
    //         </label>
    //       ))}
    //     </div>
    //   );
    // }
    if (type === "select") {
  const radioOptions = champ.noNF   // used to check if this champ should have the "Non Fait" option or not
    ? RADIO_OPTIONS_3.filter((opt) => opt.value !== "NF")
    : RADIO_OPTIONS_3;

  return (
    <div className="rb-radio-group">
      {radioOptions.map((opt) => (
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
        <Textarea
          value={value}
          onChange={onChange}
          placeholder={label}
          disabled={disabled}
        />
      );
    }

    // Type numérique ou texte par défaut
    return (
      <div className="rb-input-unit">
        <Input
          type={isNumeric ? "text" : type}
          className={`form-control ${error ? "is-invalid" : ""}`}
          value={value}
          onChange={isNumeric ? handleNumericChange : onChange}
          placeholder="—"
          disabled={disabled}
          inputMode={isNumeric ? "decimal" : undefined}
          min={isNumeric ? "0" : undefined}
          step={isNumeric ? "any" : undefined}
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

// ─────────────────────────────────────────────────────────────────────────────
// SECTION BILAN
// Affiche l'en-tête (titre + toggle NF + date) et la grille des champs.
//
// Props :
//   isNF        {boolean} — true si la section est marquée "Non Fait"
//   onToggleNF  {fn}      — callback (sectionKey) pour basculer l'état NF
//
// Comportement quand isNF === true :
//   - Toute la section est visuellement grisée (opacité réduite)
//   - Tous les champs sont disabled
//   - La date est vidée, désactivée et non obligatoire
//   - L'astérisque rouge de la date disparaît
// ─────────────────────────────────────────────────────────────────────────────
const SectionBilan = forwardRef((
  {
    section,
    sectionKey,
    formData,
    field,
    disabled,
    errors,
    onChooseGenotypageFile,
    isNF,        //  true si cette section est marquée Non Fait
    onToggleNF,  //  callback pour basculer NF
  },
  ref
) => {
  const dateKey = SECTION_DATE_KEY[sectionKey];

  // En mode NF ou en mode saving/détail, tous les champs sont désactivés
  const sectionDisabled = disabled || isNF;

  return (
    <div
      className="rb-section"
      data-section={sectionKey}
      ref={ref}
      style={{
        opacity:    isNF ? 0.5 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <div className="rb-section-header">

        {/* Titre de la section */}
        <div className="rb-section-title">
          <i className="bi bi-flask me-2" />
          {section.label}
        </div>

        {/* Toggle "Non Fait (NF)" — visible uniquement en mode saisie/modification */}
        {!disabled && (
          <label
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        6,
              cursor:     "pointer",
              fontSize:   13,
              fontWeight: 500,
              color:      isNF ? "#dc2626" : "#6b7280",
              marginLeft: "auto",
              marginRight: dateKey ? 16 : 0,
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={isNF}
              onChange={() => onToggleNF(sectionKey)}
              style={{ width: 15, height: 15, cursor: "pointer" }}
            />
            Non fait (NF)
          </label>
        )}

        {/* Date de la section */}
        {dateKey && (
          <div className="rb-section-date">
            <label htmlFor={`date-${sectionKey}`}>
              Date :{" "}
              {/* L'astérisque rouge disparaît si la section est NF */}
              {!isNF && <span style={{ color: "#dc2626" }}>*</span>}
            </label>

            {/* Mode lecture seule (vue détail) */}
            {disabled ? (
              <span className="rb-date-readonly">
                {formatDate(formData[dateKey])}
              </span>
            ) : (
              // Mode saisie / modification
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <input
                  id={`date-${sectionKey}`}
                  type="date"
                  // La valeur est forcée à vide quand la section est NF
                  value={isNF ? "" : toDateInputValue(formData[dateKey])}
                  onChange={field(dateKey)}
                  max={getTodayLocalISO()}
                  required={!isNF}           // non obligatoire si NF
                  disabled={sectionDisabled} // désactivé si NF ou saving
                  className={errors[dateKey] ? "is-invalid" : ""}
                  style={{
                    height: 38,
                    opacity: isNF ? 0.4 : 1,
                    cursor:  isNF ? "not-allowed" : "auto",
                  }}
                />
                {/* Erreur date — masquée si la section est NF */}
                {errors[dateKey] && !isNF && (
                  <FieldError error={errors[dateKey]} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Grille des champs — tous disabled si section NF ──────────────── */}
      <div className="rb-champs-grid">
        {section.champs.map((champ) => {

          // Champ fichier génotypage
          if (champ.type === "file") {
            const currentUrls = normalizeGenotypageUrls(formData[champ.key]);
            const hasFile = currentUrls.length > 0;
            const error = errors[champ.key];
            return (
              <div key={champ.key} className="rb-champ rb-champ-wide">
                <label>{champ.label}</label>
                <div className="d-flex gap-2 align-items-center">
                  {/* Bouton masqué si section NF ou saving */}
                  {!sectionDisabled && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={onChooseGenotypageFile}
                    >
                      <i className="bi bi-cloud-upload me-1"></i>
                      Choisir fichier(s)
                    </button>
                  )}
                  {hasFile && (
                    <span className="text-muted" style={{ fontSize: 12 }}>
                      ✓ {currentUrls.length} fichier(s)
                    </span>
                  )}
                </div>
                {error && <FieldError error={error} />}
                {!error && (
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6 }}>
                    <i className="bi bi-info-circle me-1"></i>
                    Max: 35MB total | Format: Images (JPG, PNG) ou PDF
                  </div>
                )}
              </div>
            );
          }

          return (
            <ChampResultat
              key={champ.key}
              champ={champ}
              value={formData[champ.key] ?? ""}
              onChange={field(champ.key)}
              disabled={sectionDisabled} // ← grisé si section NF
              error={errors[champ.key]}
            />
          );
        })}
      </div>
    </div>
  );
});

SectionBilan.displayName = "SectionBilan";

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

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL UI
// Rendu pur — zéro logique métier, zéro appel API, zéro état propre.
//
// Nouvelles props par rapport à la version précédente :
//   nfSections    {Set<string>} — clés des sections marquées NF
//   toggleSectionNF {fn}       — (sectionKey) => void
// ─────────────────────────────────────────────────────────────────────────────
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
  // NF par section
  nfSections,
  toggleSectionNF,
  // génotypage
  fileInputRef,
  genotypageSectionRef,
  openGenotypagePage,
  openGenotypagePicker,
  handleGenotypageFileChange,
}) {
  const noChamps = champsActifs.length === 0;

  return (
    <div className="ec-page-bg rb-page">

      {/* ── Titre + bouton Consulter génotypage ───────────────────────────── */}
      <div style={{
        display:       "flex",
        alignItems:    "center",
        justifyContent: "space-between",
        marginBottom:  12,
      }}>
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

      {/* ── Toolbar Annuler (visible uniquement si formulaire ouvert) ─────── */}
      {showForm && (
        <div className="rb-toolbar">
          <ActionButton
            action="annuler"
            label="Annuler"
            size="sm"
            onClick={closeForm}
          />
        </div>
      )}

      {/* ── Formulaire saisie / modification ────────────────────────────────*/}
      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Saisie des résultats biologiques"
          labelModify="Modifier les résultats biologiques"
        >
          <form onSubmit={handleSubmit}>
            {noChamps ? (
              <p className="text-muted text-center py-3">
                {MESSAGES.aucunBilanActif}
              </p>
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
                  // ↓ Props NF : état et handler passés depuis le hook
                  isNF={nfSections.has(section._key)}
                  onToggleNF={toggleSectionNF}
                  ref={
                    section._key === "test_genotypage"
                      ? genotypageSectionRef
                      : null
                  }
                />
              ))
            )}

            {/* Observations générales — toujours disponibles, hors sections */}
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
                showIcon={false}
                size="sm"
                block
                loading={saving}
                loadingLabel={MESSAGES.enregistrement}
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      {/* ── Historique des bilans prescrits ───────────────────────────────── */}
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
                  <td>
                    {formatDate(bilan.created_at)}
                  </td>
                  <td>
                    <span className="bilan-summary">
                      {formatBilanSummary(bilan)}
                    </span>
                  </td>
                  <td className="rb-obs-cell">
                    {bilan.observations || (
                      <span className="text-muted">—</span>
                    )}
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

      {/* ── Vue Détail résultat (lecture seule) ───────────────────────────── */}
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
                value={formatDate(
                  detailItem.date_resultat || detailItem.created_at
                )}
                disabled
                readOnly
              />
            </div>

            {/* En mode détail : NF non applicable, isNF=false pour toutes sections */}
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
                isNF={false}         // ← pas de NF en lecture seule
                onToggleNF={() => {}} // ← no-op en lecture seule
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
                action="annuler"
                label="Fermer"
                size="sm"
                onClick={() => setDetailItem(null)}
              />
            </div>
          </div>
        </FormulaireWrapper>
      )}
    </div>
  );
}
