import { useEffect, useMemo, useState } from "react";
import {
  ActionButton,
  FieldLabel,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  Input,
  SearchBar,
} from "../../../../../shared/components/layouts";
import { getPatientsWithOrdonnances } from "../../../services/Patientordonnanceservice";
import { updateDateProchainePrise } from "../../../services/ordonnanceService";
import { formatDateFr } from "../../../../../shared/utils/logiqueTableHistory";
import "./Patientsordonnances.css";

export default function Patientsordonnances() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showHistory, setShowHistory] = useState(true);
  const [detailItem, setDetailItem] = useState(null);
  const [validationItem, setValidationItem] = useState(null);
  const [quantiteDelivree, setQuantiteDelivree] = useState("");
  const [savingValidation, setSavingValidation] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientsWithOrdonnances();
      setPatients(Array.isArray(data?.patients) ? data.patients : []);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err?.message || err?.error || "Erreur lors du chargement");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(patients)) return [];
    const q = search.toLowerCase();
    return patients.filter((p) =>
      p.patient_name?.toLowerCase().includes(q) ||
      p.patient_surname?.toLowerCase().includes(q) ||
      p.numero_dossier?.toLowerCase().includes(q) ||
      p.nom_traitement?.toLowerCase().includes(q)
    );
  }, [patients, search]);

  const getStatutBadge = (statutCalcule, ecartJours) => {
    const statuts = {
      "perdu de vue": { class: "statut-perdu", text: "Perdu de vue" },
      "en retard": { class: "statut-retard", text: "En retard" },
      "retard leger": { class: "statut-leger", text: "Retard leger" },
      "retard léger": { class: "statut-leger", text: "Retard leger" },
      "a venir": { class: "statut-avenir", text: "A venir" },
      "à venir": { class: "statut-avenir", text: "A venir" },
      "en cours": { class: "statut-actif", text: "En cours" },
    };
    const badge = statuts[statutCalcule] || { class: "statut-default", text: statutCalcule || "N/A" };
    return (
      <div className="statut-wrapper">
        <span className={`statut-badge ${badge.class}`}>{badge.text}</span>
        {ecartJours !== null && ecartJours > 0 && <span className="ecart-badge">+{ecartJours}j</span>}
      </div>
    );
  };
  

  const calculateNextDate = (quantite) => {
    const months = parseInt(quantite, 10);
    if (!months || months <= 0) return null;
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + months);
    return nextDate;
  };

  const openValidation = (item) => {
    setValidationItem(item);
    setQuantiteDelivree("");
  };

  const handleValidate = async () => {
    if (!validationItem) return;
    if (!quantiteDelivree) {
      alert("Veuillez saisir la quantite delivree en mois.");
      return;
    }

    const nextDate = calculateNextDate(quantiteDelivree);
    if (!nextDate) {
      alert("Quantite invalide.");
      return;
    }

    const ordonnanceId = validationItem.ordonnance_id || validationItem.id;
    if (!ordonnanceId) {
      alert("Ordonnance introuvable.");
      return;
    }

    setSavingValidation(true);
    try {
      await updateDateProchainePrise(ordonnanceId, nextDate.toISOString().split("T")[0]);
      alert("Ordonnance validee avec succes.");
      setValidationItem(null);
      setQuantiteDelivree("");
      await loadPatients();
    } catch (err) {
      console.error("Erreur validation:", err);
      alert(err?.message || err?.error || "Erreur lors de la validation.");
    } finally {
      setSavingValidation(false);
    }
  };

  if (loading) {
    return (
      <div className="ordonnances-page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des ordonnances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ordonnances-page-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <ActionButton action="save" label="Reessayer" onClick={loadPatients} showIcon={false} />
        </div>
      </div>
    );
  }
const validateItem = (item) => {
  // Logique de validation de l'élément
  console.log("Item validé:", item);
};
  return (
    <div className="ordonnances-page-container">
      <div className="ordonnances-header">
        <h2 className="page-title">Liste des ordonnances VIH ({filtered.length})</h2>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label=""
          placeholder="Rechercher par nom, prenom ou traitement"
          wrapperClassName="ord-search"
          inputClassName="search-input"
        />
      </div>

      <HistoriqueAccordeon
        title=""
        count={filtered.length}
        showCount={false}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
        hideTitle
        contentClassName="ord-acc-body"
      >
        <HistoriqueTable
          headers={["N dossier", "Patient", "Traitement", "Prochaine prise", "Quantite", "Statut", "Action"]}
          items={filtered}
          emptyMessage={search ? "Aucun resultat trouve" : "Aucune ordonnance enregistree"}
          renderRow={(p) => (
            <tr key={p.ordonnance_id || `${p.numero_dossier}-${p.nom_traitement}`}>
              <td className="td-numero">
                <span className="numero-simple">{p.numero_dossier || "-"}</span>
              </td>
              <td className="td-patient">{`${p.patient_surname || "-"} ${p.patient_name || ""}`.trim()}</td>
              <td className="td-traitement">{p.nom_traitement || "Aucun"}</td>
              <td className="td-date">
                {p.date_prochaine_prise ? (
                  <span className={p.ecart_jours > 0 ? "date-retard" : "date-future"}>
                    {formatDateFr(p.date_prochaine_prise, "-")}
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td className="td-quantite">{p.quantite_prescrite || "-"}</td>
              <td className="td-statut">{getStatutBadge(p.statut_calcule, p.ecart_jours)}</td>
              <td className="td-action">
<HistoriqueActions
  onDetails={() => setDetailItem(p)}
  onValidate={() => validateItem(p)} // Passer la fonction validateItem
/>              </td>
            </tr>
          )}
        />
      </HistoriqueAccordeon>

      {detailItem && (
        <div className="ord-modal-backdrop" onClick={() => setDetailItem(null)}>
          <div className="ord-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="ord-modal-title">Details ordonnance</h3>
            <div className="ord-modal-grid">
              <div><strong>Dossier:</strong> {detailItem.numero_dossier || "-"}</div>
              <div><strong>Patient:</strong> {detailItem.patient_surname || "-"} {detailItem.patient_name || "-"}</div>
              <div><strong>Traitement:</strong> {detailItem.nom_traitement || "-"}</div>
              <div><strong>Date debut:</strong> {formatDateFr(detailItem.date_debut_traitement, "-")}</div>
              <div><strong>Prochaine prise:</strong> {formatDateFr(detailItem.date_prochaine_prise, "-")}</div>
              <div><strong>Quantite prescrite:</strong> {detailItem.quantite_prescrite || "-"}</div>
              <div><strong>Statut:</strong> {detailItem.statut_calcule || "-"}</div>
            </div>
            <div className="ord-modal-actions">
              <ActionButton action="save" label="Fermer" size="sm" showIcon={false} onClick={() => setDetailItem(null)} />
            </div>
          </div>
        </div>
      )}

      {validationItem && (
        <div className="ord-modal-backdrop" onClick={() => !savingValidation && setValidationItem(null)}>
          <div className="ord-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="ord-modal-title">Validation ordonnance</h3>
            <p className="ord-modal-subtitle">
              Patient: <strong>{validationItem.patient_surname || "-"} {validationItem.patient_name || "-"}</strong> - Dossier:{" "}
              <strong>{validationItem.numero_dossier || "-"}</strong>
            </p>

            <FieldLabel>Quantite delivree (en mois)</FieldLabel>
            <Input
              type="number"
              min="1"
              className="ord-input"
              value={quantiteDelivree}
              onChange={(e) => setQuantiteDelivree(e.target.value)}
              placeholder="Ex: 1, 2, 3..."
            />

            {quantiteDelivree && (
              <p className="ord-preview">
                Nouvelle date prochaine prise: <strong>{formatDateFr(calculateNextDate(quantiteDelivree), "-")}</strong>
              </p>
            )}

            <div className="ord-modal-actions">
              <button
                type="button"
                className="btn-action btn-close"
                onClick={() => setValidationItem(null)}
                disabled={savingValidation}
              >
                Annuler
              </button>
              <ActionButton
                action="save"
                label={savingValidation ? "Validation..." : "Valider"}
                showIcon={false}
                size="sm"
                disabled={savingValidation}
                onClick={handleValidate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
