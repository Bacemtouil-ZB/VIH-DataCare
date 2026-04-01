import {
  ActionButton,
  Badge,
  FieldLabel,
  FormulaireWrapper,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  Input,
  Spinner,
} from "../../../../../shared/components/index";
import Textarea from "../../../components/UI/Textarea";
import PageTitle from "../../../components/UI/PageTitle";
import BilanResultSection from "../../../components/UI/BilanResultSection";
import { HISTORIQUE_HEADERS, MESSAGES } from "./ResultatsbiologiquesConstants";

function ResultatResume({ resultat, champsActifs }) {
  const filled = champsActifs
    .flatMap((section) => section.champs)
    .filter(({ key }) => resultat[key] !== null && resultat[key] !== undefined && resultat[key] !== "")
    .length;
  const total = champsActifs.flatMap((section) => section.champs).length;

  return (
    <Badge bg="#e0f2fe" color="#075985">
      {filled}/{total} champs renseignes
    </Badge>
  );
}

export default function ResultatsBiologiquesUI({
  bilanPrescrit,
  champsActifs,
  resultats,
  loading,
  saving,
  showForm,
  showHistory,
  setShowHistory,
  isModifying,
  detailItem,
  setDetailItem,
  formData,
  field,
  openCreate,
  openEdit,
  closeForm,
  handleShowDetails,
  handleSubmit,
}) {
  const noBilan = !bilanPrescrit;
  const noChamps = champsActifs.length === 0;

  return (
    <div className="ec-page-bg rb-page">
      <PageTitle title="Resultats biologiques" />

      {noBilan && !loading && (
        <div className="rb-alert-no-bilan">
          <i className="bi bi-info-circle me-2" />
          {MESSAGES.aucunBilan}
        </div>
      )}

      {!noBilan && (
        <div className="rb-toolbar">
          {!showForm ? (
            <ActionButton action="add" label="Saisir les resultats" size="sm" onClick={openCreate} />
          ) : (
            <ActionButton action="annuler" label="Annuler" size="sm" onClick={closeForm} />
          )}
        </div>
      )}

      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Saisie des resultats biologiques"
          labelModify="Modifier les resultats biologiques"
        >
          <form onSubmit={handleSubmit}>
            {noChamps ? (
              <p className="text-muted text-center py-3">{MESSAGES.aucunBilanActif}</p>
            ) : (
              champsActifs.map((section) => (
                <BilanResultSection
                  key={section._key || section.label}
                  section={section}
                  sectionKey={section._key || ""}
                  formData={formData}
                  field={field}
                  disabled={saving}
                />
              ))
            )}

            <div className="rb-observations">
              <FieldLabel>Observations generales</FieldLabel>
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
                label={isModifying ? "Mettre a jour" : "Enregistrer"}
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

      <HistoriqueAccordeon
        title="Historique des resultats biologiques"
        count={resultats.length}
        open={showHistory}
        onToggle={() => setShowHistory((value) => !value)}
      >
        {loading ? (
          <Spinner />
        ) : (
          <HistoriqueTable
            headers={HISTORIQUE_HEADERS}
            items={resultats}
            emptyMessage={MESSAGES.aucunResultat}
            renderRow={(item) => (
              <tr key={item.id}>
                <td>{new Date(item.date_resultat || item.created_at).toLocaleDateString("fr-FR")}</td>
                <td>
                  <ResultatResume resultat={item} champsActifs={champsActifs} />
                </td>
                <td className="rb-obs-cell">{item.observations || <span className="text-muted">-</span>}</td>
                <td>
                  <HistoriqueActions onDetails={() => handleShowDetails(item)} onEdit={() => openEdit(item)} />
                </td>
              </tr>
            )}
          />
        )}
      </HistoriqueAccordeon>

      {detailItem && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Details des resultats biologiques"
          labelModify="Details des resultats biologiques"
        >
          <div className="ec-readonly-block">
            <div className="rb-date-row">
              <FieldLabel>Date du resultat</FieldLabel>
              <Input
                type="text"
                className="form-control"
                value={new Date(detailItem.date_resultat || detailItem.created_at).toLocaleDateString("fr-FR")}
                disabled
                readOnly
              />
            </div>

            {champsActifs.map((section) => (
              <BilanResultSection
                key={section._key || section.label}
                section={section}
                sectionKey={section._key || ""}
                formData={detailItem}
                field={() => () => {}}
                disabled
                showDetailDate
              />
            ))}

            {detailItem.observations && (
              <div className="rb-observations">
                <FieldLabel>Observations</FieldLabel>
                <Textarea value={detailItem.observations} disabled />
              </div>
            )}

            <div className="rb-form-actions">
              <ActionButton action="annuler" label="Fermer" size="sm" onClick={() => setDetailItem(null)} />
            </div>
          </div>
        </FormulaireWrapper>
      )}
    </div>
  );
}
