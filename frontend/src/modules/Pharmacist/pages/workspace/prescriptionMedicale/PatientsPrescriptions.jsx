import { useEffect, useMemo, useState } from "react";
import {
  ActionButton,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  SearchBar,
} from "../../../../../shared/components";
import { getPatientsWithPrescriptions } from "../../../services/patientPrescriptionService";
import { validatePrescription } from "../../../services/prescriptionWorkflowService";
import { formatDateFr } from "../../../../../shared/utils/logiqueTableHistory";
import "./PatientsPrescriptions.css";

export default function PatientsPrescriptions() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [detailItem, setDetailItem] = useState(null);
  const [validationItem, setValidationItem] = useState(null);
  const [savingValidation, setSavingValidation] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientsWithPrescriptions();
      setPatients(Array.isArray(data?.patients) ? data.patients : []);
    } catch (err) {
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
      p.nom_traitement?.toLowerCase().includes(q),
    );
  }, [patients, search]);

  const getSuiviBadge = (statutPatient, ecartJours) => {
    const key = (statutPatient || "").toLowerCase();
    const isPerdu = key.includes("perdue") || key.includes("perdu");
    const isAttente = key.includes("attente");
    const badgeClass = isPerdu ? "statut-perdu" : isAttente ? "statut-leger" : "statut-actif";
    const badgeText = isPerdu ? "Perdue de vue" : isAttente ? "En attente" : "Actif";

    return (
      <div className="statut-wrapper">
        <span className={`statut-badge ${badgeClass}`}>{badgeText}</span>
        {!isAttente && ecartJours > 0 && <span className="ecart-badge">+{ecartJours}j</span>}
      </div>
    );
  };

  const getPrescriptionStatusBadge = (statutPrescription) => {
    const key = (statutPrescription || "envoyee").toLowerCase();
    const isDelivree = key === "delivree";
    return (
      <span className={`statut-badge ${isDelivree ? "statut-actif" : "statut-avenir"}`}>
        {isDelivree ? "Delivree" : "Envoyee"}
      </span>
    );
  };

  const calculatePreviewDate = (quantite) => {
    const months = Number.parseInt(quantite, 10);
    if (!months || months <= 0) return null;
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + months);
    return nextDate;
  };

  const openValidation = (item) => {
    setValidationItem(item);
  };

  const handleValidate = async () => {
    if (!validationItem) return;
    const prescriptionId = validationItem.prescription_id || validationItem.id;
    if (!prescriptionId) return;

    setSavingValidation(true);
    try {
      await validatePrescription(prescriptionId);
      setValidationItem(null);
      await loadPatients();
    } catch (err) {
      alert(err?.message || err?.error || "Erreur lors de la validation.");
    } finally {
      setSavingValidation(false);
    }
  };

  if (loading) {
    return (
      <div className="prescriptions-page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Chargement des prescriptions medicales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescriptions-page-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <ActionButton action="save" label="Reessayer" onClick={loadPatients} showIcon={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="prescriptions-page-container">
      <div className="prescriptions-header">
        <h2 className="page-title">Liste des prescriptions VIH ({filtered.length})</h2>
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label=""
          placeholder="Rechercher par nom, prenom ou traitement"
          wrapperClassName="prescription-search"
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
        contentClassName="prescription-acc-body"
      >
        <HistoriqueTable
          headers={[
            "N dossier",
            "Patient",
            "Traitement",
            "Prochaine prise",
            "Quantite",
            "Statut prescription",
            "Suivi therapeutique",
            "Action",
          ]}
          items={filtered}
          emptyMessage={search ? "Aucun resultat trouve" : "Aucune prescription enregistree"}
          renderRow={(p) => (
            <tr key={p.prescription_id || `${p.numero_dossier}-${p.nom_traitement}`}>
              <td className="td-numero">
                <span className="numero-simple">{p.numero_dossier || "-"}</span>
              </td>
              <td className="td-patient">{`${p.patient_surname || "-"} ${p.patient_name || ""}`.trim()}</td>
              <td className="td-traitement">{p.nom_traitement || "Aucun"}</td>
              <td className="td-date">
                {p.date_prochaine_prise ?
                  <span className={p.ecart_jours > 0 ? "date-retard" : "date-future"}>
                    {formatDateFr(p.date_prochaine_prise, "-")}
                  </span>
                : "-"}
              </td>
              <td className="td-quantite">{p.quantite_prescrite || "-"}</td>
              <td className="td-statut">{getPrescriptionStatusBadge(p.statut_prescription)}</td>
              <td className="td-statut">{getSuiviBadge(p.statut_patient, p.ecart_jours)}</td>
              <td className="td-action">
                <HistoriqueActions
                  onDetails={() => setDetailItem(p)}
                  onValidate={() => openValidation(p)}
                  validateProps={{ disabled: (p.statut_prescription || "").toLowerCase() === "delivree" }}
                />
              </td>
            </tr>
          )}
        />
      </HistoriqueAccordeon>

      {detailItem && (
        <div className="prescription-modal-backdrop" onClick={() => setDetailItem(null)}>
          <div className="prescription-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="prescription-modal-title">Details prescription</h3>
            <div className="prescription-modal-grid">
              <div><strong>Dossier:</strong> {detailItem.numero_dossier || "-"}</div>
              <div><strong>Patient:</strong> {detailItem.patient_surname || "-"} {detailItem.patient_name || "-"}</div>
              <div><strong>Traitement:</strong> {detailItem.nom_traitement || "-"}</div>
              <div><strong>Date debut:</strong> {formatDateFr(detailItem.date_debut_traitement, "-")}</div>
              <div><strong>Date delivrance:</strong> {formatDateFr(detailItem.date_delivrance, "-")}</div>
              <div><strong>Prochaine prise:</strong> {formatDateFr(detailItem.date_prochaine_prise, "-")}</div>
              <div><strong>Quantite prescrite:</strong> {detailItem.quantite_prescrite || "-"}</div>
              <div><strong>Statut prescription:</strong> {detailItem.statut_prescription || "-"}</div>
              <div><strong>Statut patient:</strong> {detailItem.statut_patient || "-"}</div>
              <div><strong>Ecart:</strong> {detailItem.ecart_jours || 0} jour(s)</div>
            </div>
            <div className="prescription-modal-actions">
              <ActionButton action="save" label="Fermer" size="sm" showIcon={false} onClick={() => setDetailItem(null)} />
            </div>
          </div>
        </div>
      )}

      {validationItem && (
        <div className="prescription-modal-backdrop" onClick={() => !savingValidation && setValidationItem(null)}>
          <div className="prescription-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="prescription-modal-title">Validation prescription</h3>
            <p className="prescription-modal-subtitle">
              Patient: <strong>{validationItem.patient_surname || "-"} {validationItem.patient_name || "-"}</strong> - Dossier:{" "}
              <strong>{validationItem.numero_dossier || "-"}</strong>
            </p>
            <p className="prescription-preview">
              Quantite prescrite: <strong>{validationItem.quantite_prescrite || "-"}</strong> mois
            </p>
            <p className="prescription-preview">
              Prochaine prise estimee:{" "}
              <strong>{formatDateFr(calculatePreviewDate(validationItem.quantite_prescrite), "-")}</strong>
            </p>

            <div className="prescription-modal-actions">
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
