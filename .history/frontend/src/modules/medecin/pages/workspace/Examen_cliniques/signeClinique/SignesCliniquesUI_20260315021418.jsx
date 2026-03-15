import { ActionButton } from "../../../../../../shared/components";
import { FieldLabel,FieldError } from "../../../../../../shared/components";
import {
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  EmptyState,
  FormulaireWrapper,
  Badge,
  ImcField,
  AutresSignesSection,
} from "../index";
import { formatDateFr } from "../../../../../../shared/utils/logiqueTableHistory";
import { HISTORY_HEADERS ,calcIMC } from "./signesCliniquesConstants";

// ? 
function Field({ label, value }) {
  return (
    <div className="ec-flex-input">
      <FieldLabel>{label}</FieldLabel>
      <input type="number" className="form-control form-control-sm" value={value ?? ""} disabled readOnly />
    </div>
  );
}

export default function SignesCliniquesUI({
  historique,
  errors,
  showHistory,
  setShowHistory,
  handleShowDetails,
  handleEdit,
  detailSigne,
  setDetailSigne,
  showForm,
  isModifying,
  saving,
  taille,
  setTaille,
  poids,
  setPoids,
  imc,
  appareils,
  autresSignes,
  appareilSel,
  description,
  setAppareilSel,
  setDescription,
  ajouterAutreSigne,
  supprimerAutreSigne,
  modifierDescription,
  handleSave,
}) {
  return (
    <>
      {showForm && (
        <FormulaireWrapper isModifying={isModifying} labelCreate="Nouveau signe clinique" labelModify="Modifier le signe clinique">
          <p className="text-uppercase fw-bold text-secondary mb-3 ec-th-sm">Mesures anthropométriques</p>
          <div className="d-flex gap-4 flex-wrap mb-4 pb-4 border-bottom">
            <div className="ec-flex-input">
              <FieldLabel required>Taille (cm)</FieldLabel>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="ex: 175"
                min={1}
                max={250}
                value={taille}
                onChange={(e) => setTaille(e.target.value)}
              />
              <FieldError error={errors.typage_hla_b5701} />
            </div>
            <div className="ec-flex-input">
              <FieldLabel required>Poids (kg)</FieldLabel>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="ex: 70"
                min={1}
                max={300}
                value={poids}
                onChange={(e) => setPoids(e.target.value)}
              />
            </div>
            <div className="ec-flex-input-l">
              <FieldLabel>IMC (kg/m2)</FieldLabel>
              <ImcField imc={imc} />
            </div>
          </div>

          <AutresSignesSection
            title="Autres signes cliniques"
            appareils={appareils}
            autresSignes={autresSignes}
            appareilSelectionne={appareilSel}
            descriptionSigne={description}
            onAppareilChange={setAppareilSel}
            onDescriptionChange={setDescription}
            onAjouter={ajouterAutreSigne}
            onSupprimer={supprimerAutreSigne}
            onModifierDescription={modifierDescription}
          />
          <ActionButton
            action="save"
            block={true}
            loading={saving}
            label={isModifying ? "Enregistrer les modifications" : "Enregistrer la fiche"}
            onClick={handleSave}
            showIcon={false}
            height="40px"
          />
        </FormulaireWrapper>
      )}

      <HistoriqueAccordeon
        title="Historique des signes cliniques"
        count={historique.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        <HistoriqueTable
          headers={HISTORY_HEADERS}
          items={historique}
          emptyMessage="Aucun signe clinique enregistré"
          renderRow={(s) => {
            const si = s.taille && s.poids ? calcIMC(+s.taille, +s.poids) : null;
            return (
              <tr key={s.id}>
                <td className="ec-td-date">{formatDateFr(s.date_examen)}</td>
                <td><Badge bg="#dbeafe" color="#1d4ed8">{s.taille ?? "N/A"}</Badge></td>
                <td><Badge bg="#dcfce7" color="#166534">{s.poids ?? "N/A"}</Badge></td>
                <td>{si ? <span className="fw-bold">{si.val} <small className="fw-normal">{si.label}</small></span> : "N/A"}</td>
                <td><HistoriqueActions onDetails={() => handleShowDetails(s)} onEdit={() => handleEdit(s)} /></td>
              </tr>
            );
          }}
        />
      </HistoriqueAccordeon>

      {detailSigne && (
        <FormulaireWrapper isModifying={false} labelCreate="Détails du signe clinique" labelModify="Détails du signe clinique">
          <div className="ec-readonly-block">
            <p className="text-uppercase fw-bold text-secondary mb-3 ec-th-sm">Mesures anthropométriques</p>
            <div className="d-flex gap-4 flex-wrap mb-4 pb-4 border-bottom">
              <Field label="Taille (cm)" value={detailSigne.taille} />
              <Field label="Poids (kg)" value={detailSigne.poids} />
              <div className="ec-flex-input-l">
                <FieldLabel>IMC (kg/m2)</FieldLabel>
                <ImcField imc={detailSigne.taille && detailSigne.poids ? calcIMC(+detailSigne.taille, +detailSigne.poids) : null} />
              </div>
            </div>

            <p className="text-uppercase fw-bold text-secondary mb-3 ec-th-sm">Autres signes cliniques</p>
            {detailSigne.autres_signes?.length > 0 ? (
              <table className="table table-sm table-hover mb-4">
                <thead className="table-light">
                  <tr>
                    <th className="ec-th-appareil">Appareil</th>
                    <th className="ec-th-desc">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {detailSigne.autres_signes.map((as, i) => (
                    <tr key={`${as.appareil || "app"}-${i}`}>
                      <td className="ec-td-vmiddle"><Badge bg="#e0f2fe" color="#0369a1">{as.appareil || "-"}</Badge></td>
                      <td className="ec-td-vmiddle"><span className="ec-desc-text">{as.description || "-"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="Aucun autre signe" />
            )}
          </div>

          <div className="d-flex justify-content-end">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setDetailSigne(null)}>Fermer détails</button>
          </div>
        </FormulaireWrapper>
      )}
    </>
  );
}


