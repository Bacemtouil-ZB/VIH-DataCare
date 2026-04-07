import { useState, useRef, useEffect } from "react";
import {
  ActionButton, Badge, EmptyState, FieldLabel,
  FormulaireWrapper, HistoriqueAccordeon, HistoriqueActions,
  HistoriqueTable, Input, PageTitle, SearchBar, Spinner,
} from "../../../../../shared/components";
import { toFrDate, toInputDate } from "../../../../../shared/utils/dateHelpers";
import { getStatutStyle } from "./prescreptionMedicalHelpers";
import { STATUT_LABELS } from "./prescreptionMedicalConstants";
import ConfirmPrescriptionModal from "../../../components/UI/Confirmprescriptionmodal";

// ── Helper : affiche une liste de traitements en pills ─────────────
function TraitementPills({ medicaments }) {
  if (!medicaments || medicaments.length === 0)
    return <span className="text-muted">-</span>;

  return (
    <div className="pe-traitement-pills">
      {medicaments.map((m, i) => (
        <span key={i} className="pe-traitement-pill">
          {m.medicament_nom_snapshot || "-"}
        </span>
      ))}
    </div>
  );
}

// ── Dropdown multi-select avec checkboxes ──────────────────────────
function MedMultiSelect({ stockItems, selectedIds, onChange }) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = stockItems.filter((m) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (m.composition || "").toLowerCase().includes(q) ||
      (m.code        || "").toLowerCase().includes(q) ||
      (m.nom         || "").toLowerCase().includes(q)
    );
  });

  const toggle = (id) => {
    const sid = String(id);
    const next = selectedIds.includes(sid)
      ? selectedIds.filter((x) => x !== sid)
      : [...selectedIds, sid];
    onChange(next);
  };

  const removePill = (e, id) => {
    e.stopPropagation();
    onChange(selectedIds.filter((x) => x !== String(id)));
  };

  const selectedMeds = stockItems.filter((m) =>
    selectedIds.includes(String(m.id))
  );

  return (
    <div className="pe-col-span-2">
      <FieldLabel required>Médicaments</FieldLabel>

      <div ref={wrapperRef} className="pe-ms-wrapper">
        <div
          className={`pe-ms-trigger${open ? " open" : ""}`}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="pe-ms-trigger-inner">
            {selectedMeds.length === 0 ? (
              <span className="pe-ms-placeholder">
                Sélectionner des médicaments...
              </span>
            ) : (
              selectedMeds.map((m) => (
                <span key={m.id} className="pe-ms-tag">
                  [{m.code || m.composition}]
                  <span
                    className="pe-ms-tag-remove"
                    onClick={(e) => removePill(e, m.id)}
                  >
                    ×
                  </span>
                </span>
              ))
            )}
          </div>
          <span className={`pe-ms-chevron${open ? " open" : ""}`}>▼</span>
        </div>

        {open && (
          <div className="pe-ms-dropdown">
            <input
              autoFocus
              className="pe-ms-search"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="pe-ms-list">
              {filtered.length === 0 && (
                <div className="pe-ms-empty">Aucun résultat</div>
              )}
              {filtered.map((med) => {
                const qty      = med.quantite ?? med.quantity ?? 0;
                const disabled = qty === 0;
                const checked  = selectedIds.includes(String(med.id));
                return (
                  <label
                    key={med.id}
                    className={`pe-ms-option${disabled ? " disabled" : ""}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => !disabled && toggle(med.id)}
                    />
                    <span className="pe-ms-option-label">
                      {med.code && <strong>[{med.code}]</strong>}{" "}
                      {med.composition || med.nom || "Médicament"}
                    </span>
                    <span className={`pe-ms-stock${disabled ? " out" : ""}`}>
                      Stock : {qty}
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="pe-ms-footer">
              <button
                type="button"
                className="pe-ms-close-btn"
                onClick={() => setOpen(false)}
              >
                {selectedMeds.length > 0
                  ? `Valider (${selectedMeds.length} sélectionné${selectedMeds.length > 1 ? "s" : ""})`
                  : "Fermer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────
export default function PrescreptionMedicalUI({
  filtered, loading, showHistory, setShowHistory,
  handleShowDetails, detailItem, setDetailItem,
  showForm, formData, field,
  stockItems, setMedicamentIds,
  isModifying, saving, closeForm, handleSubmit,
  searchTerm, setSearchTerm, searchDate, setSearchDate,
  openCreate, confirmationModal, closeConfirmationModal,
  confirmPrescription, medecinDisplayName,
}) {
  const today = toInputDate(new Date());

  return (
    <div className="ec-page-bg pe-page">
      <PageTitle title="Prescription medicale" />

      <div className="pe-toolbar">
        <div className="pe-toolbar-left">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un medicament, .."
            wrapperClassName="pe-search"
          />
          <SearchBar
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            wrapperClassName="pe-search pe-search-date"
            max={today}
          />
        </div>
        {!showForm
          ? <ActionButton action="add"     label="Ajouter"  size="sm" onClick={openCreate} />
          : <ActionButton action="annuler" label="Annuler"  size="sm" onClick={closeForm}  />
        }
      </div>

      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Nouvelle prescription medicale"
          labelModify="Modifier la prescription"
        >
          <form onSubmit={handleSubmit}>
            <div className="pe-form-grid">
              <MedMultiSelect
                stockItems={stockItems}
                selectedIds={formData.medicament_ids}
                onChange={setMedicamentIds}
              />
              <div>
                <FieldLabel>Posologie</FieldLabel>
                <Input
                  value={formData.posologie}
                  onChange={field("posologie")}
                  placeholder="Ex : 500 mg"
                />
              </div>
              <div>
                <FieldLabel required>Durée (jours)</FieldLabel>
                <Input
                  type="number"
                  min="1"
                  value={formData.periode}
                  onChange={field("periode")}
                />
              </div>
              <div className="pe-col-span-2">
                <FieldLabel>Remarque</FieldLabel>
                <textarea
                  className="pe-textarea form-control"
                  rows={3}
                  value={formData.remarque}
                  onChange={field("remarque")}
                  placeholder="Observations ou instructions complementaires (optionnel)"
                />
              </div>
            </div>
            <div className="pe-form-actions">
              <ActionButton
                action="save"
                label={isModifying ? "Mettre a jour" : "Confirmer"}
                loading={saving}
                size="sm"
                showIcon={false}
                block={true}
                type="submit"
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      {/* ── Historique ── */}
      <HistoriqueAccordeon
        title="Historique des prescriptions medicales"
        count={filtered.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ? <Spinner />
          : filtered.length === 0
            ? <EmptyState message="Aucune prescription enregistree." />
            : <HistoriqueTable
                headers={["Date", "Médicaments", "Posologie", "Durée (j)", "Statut", "Action"]}
                items={filtered}
                emptyMessage="Aucune prescription enregistree."
                renderRow={(p) => (
                  <tr key={p.id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {toFrDate(p.date)}
                    </td>
                    <td>
                      <TraitementPills medicaments={p.medicaments} />
                    </td>
                    <td>{p.posologie || "-"}</td>
                    <td>{p.periode || "-"}</td>
                    <td>
                      <Badge
                        bg={getStatutStyle(p.statut).bg}
                        color={getStatutStyle(p.statut).color}
                      >
                        {STATUT_LABELS[p.statut] || p.statut || "-"}
                      </Badge>
                    </td>
                    <td>
                      <HistoriqueActions onDetails={() => handleShowDetails(p)} />
                    </td>
                  </tr>
                )}
              />
        }
      </HistoriqueAccordeon>

      {/* ── Détail ── */}
      {detailItem && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Details de la prescription"
          labelModify="Details de la prescription"
        >
          <div className="pe-detail-grid">

            <div className="pe-col-span-2">
              <FieldLabel>Médicaments</FieldLabel>
              <div className="pe-detail-pills-box">
                <TraitementPills medicaments={detailItem.medicaments} />
              </div>
            </div>

            <div>
              <FieldLabel>Date</FieldLabel>
              <Input value={toFrDate(detailItem.date)} disabled />
            </div>
            <div>
              <FieldLabel>Posologie</FieldLabel>
              <Input value={detailItem.posologie || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Durée (jours)</FieldLabel>
              <Input value={detailItem.periode || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Statut</FieldLabel>
              <Input
                value={STATUT_LABELS[detailItem.statut] || detailItem.statut || "-"}
                disabled
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <FieldLabel>Remarque</FieldLabel>
              <textarea
                className="pe-textarea form-control"
                rows={3}
                value={detailItem.remarque || "-"}
                disabled
              />
            </div>
          </div>
          <div className="pe-form-actions">
            <ActionButton
              action="annuler"
              label="Fermer"
              size="sm"
              onClick={() => setDetailItem(null)}
            />
          </div>
        </FormulaireWrapper>
      )}

      <ConfirmPrescriptionModal
        show={!!confirmationModal}
        data={confirmationModal?.data}
        saving={saving}
        medecinDisplayName={medecinDisplayName}
        onConfirm={confirmPrescription}
        onClose={closeConfirmationModal}
      />
    </div>
  );
}