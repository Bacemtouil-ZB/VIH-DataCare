import {
  ActionButton,
  Badge,
  FieldLabel,
  FormulaireWrapper,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  Input,
  PageTitle,
  SearchBar,
  Spinner,
} from "../../../../../shared/components";
import InfoBanner from "../../../components/UI/InfoBanner.jsx";
import { toFrDate, toInputDate } from "../../../../../shared/utils/dateHelpers";

export default function RendezVousUI({
  filtered,
  prochainePriseReference,
  loading,
  showHistory,
  setShowHistory,
  handleShowDetails,
  openEdit,
  detailRdv,
  setDetailRdv,
  statusStyle,
  searchDate,
  setSearchDate,
  showForm,
  openCreate,
  closeForm,
  formData,
  setFormData,
  isModifying,
  handleSubmit,
}) {
  const today = toInputDate(new Date());

  return (
    <>
      <PageTitle title="Gestion des rendez-vous" />

      <div className="rdv-toolbar">
        <SearchBar
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          max={today}
          wrapperClassName="rdv-search"
        />
        {!showForm ? (
          <ActionButton action="add" label="Ajouter" size="sm" onClick={openCreate} />
        ) : (
          <ActionButton action="annuler" label="Annuler" size="sm" onClick={() => closeForm()} />
        )}
      </div>

      {prochainePriseReference && (
        <InfoBanner variant="success">
          <span className="info-banner__label">Date prochain rendez-vous estimée:</span>
          <strong className="info-banner__value">{toFrDate(prochainePriseReference.date)}</strong>
        </InfoBanner>
      )}

      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Nouveau rendez-vous"
          labelModify="Modifier le rendez-vous"
        >
          <form onSubmit={handleSubmit}>
            <div className="rdv-form-grid">
              <div>
                <FieldLabel required>Date du rendez-vous</FieldLabel>
                <Input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  min={today}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel>Heure</FieldLabel>
                <Input
                  type="time"
                  className="form-control"
                  value={formData.heure}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heure: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel>Type</FieldLabel>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Suivi">Suivi</option>
                  <option value="Biologie">Controle</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Urgence">Urgence</option>
                </select>
              </div>
              <div>
                <FieldLabel>Statut</FieldLabel>
                <select
                  className="form-select"
                  value={formData.statut}
                  onChange={(e) => setFormData((prev) => ({ ...prev, statut: e.target.value }))}
                >
                  <option value="Planifie">Planifie</option>
                  <option value="Confirme">Confirme</option>
                  <option value="Annule">Annule</option>
                  <option value="Termine">Termine</option>
                </select>
              </div>
              <div className="rdv-col-span-2">
                <FieldLabel>Commentaire</FieldLabel>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.commentaire}
                  onChange={(e) => setFormData((prev) => ({ ...prev, commentaire: e.target.value }))}
                  placeholder="Note interne (optionnel)"
                />
              </div>
            </div>
            <div className="rdv-form-actions">
              <ActionButton
                action="save"
                label={isModifying ? "Mettre à jour" : "Enregistrer"}
                showIcon={false}
                size="sm"
                block
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      <HistoriqueAccordeon
        title="Historique des rendez-vous"
        count={filtered.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ? (
          <Spinner />
        ) : (
          <HistoriqueTable
            headers={["Date", "Heure", "Type", "Statut", "Action"]}
            items={filtered}
            emptyMessage="Aucun rendez-vous enregistré."
            renderRow={(r) => (
              <tr key={r.id}>
                <td>{toFrDate(r.date)}</td>
                <td>{r.heure}</td>
                <td>{r.type}</td>
                <td>
                  <Badge bg={statusStyle(r.statut).bg} color={statusStyle(r.statut).color}>
                    {r.statut}
                  </Badge>
                </td>
                <td>
                  <HistoriqueActions onDetails={() => handleShowDetails(r)} onEdit={() => openEdit(r)} />
                </td>
              </tr>
            )}
          />
        )}
      </HistoriqueAccordeon>

      {detailRdv && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Détails du rendez-vous"
          labelModify="Détails du rendez-vous"
        >
          <div className="ec-readonly-block">
            <div className="rdv-detail-grid">
              <div>
                <FieldLabel>Date</FieldLabel>
                <Input type="text" className="form-control" value={toFrDate(detailRdv.date)} disabled readOnly />
              </div>
              <div>
                <FieldLabel>Heure</FieldLabel>
                <Input type="text" className="form-control" value={detailRdv.heure || "-"} disabled readOnly />
              </div>
              <div>
                <FieldLabel>Type</FieldLabel>
                <select className="form-select" value={detailRdv.type || ""} disabled>
                  <option value={detailRdv.type || ""}>{detailRdv.type || "-"}</option>
                </select>
              </div>
              <div>
                <FieldLabel>Statut</FieldLabel>
                <select className="form-select" value={detailRdv.statut || ""} disabled>
                  <option value={detailRdv.statut || ""}>{detailRdv.statut || "-"}</option>
                </select>
              </div>
              <div className="rdv-col-span-2">
                <FieldLabel>Commentaire</FieldLabel>
                <textarea className="form-control" rows={3} value={detailRdv.commentaire || "-"} disabled readOnly />
              </div>
            </div>
            <div className="rdv-form-actions">
              <ActionButton
                action="annuler"
                label="Fermer"
                size="sm"
                onClick={() => setDetailRdv(null)}
              />
            </div>
          </div>
        </FormulaireWrapper>
      )}
    </>
  );
}
