import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ActionButton,
  Badge,
  EmptyState,
  FieldLabel,
  FormulaireWrapper,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  Input,
  PageHeader,
  SearchBar,
  Spinner,
} from "../../../../../shared/components/layouts";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import { openFormForCreate } from "../../../../../shared/utils/logiqueTableHistory";
import { toFrDate } from "../../../../../shared/utils/dateHelpers";
import {
  createPrescription,
  getPrescriptionsByNumeroDossier,
  getStockMedicaments,
  updatePrescription,
} from "../../../services/precriptionMedicalService.jsx";
import "./PrescreptionMedical.css";

// ── Constantes ────────────────────────────────────────────────────────
const INITIAL_FORM = {
  medicament_id: "",
  traitement: "",
  posologie: "",
  date: new Date().toISOString().slice(0, 10),
  quantite: "",
  dosage: "",
  remarque: "",
};

const STATUT_LABELS = {
  En_attente: "En attente",
  En_cours:   "En cours",
  Effectue:   "Effectué",
  Annule:     "Annulé",
};

const STATUT_STYLE = {
  En_attente: { bg: "#fef9c3", color: "#854d0e" },
  En_cours:   { bg: "#e0f2fe", color: "#075985" },
  Effectue:   { bg: "#dcfce7", color: "#166534" },
  Annule:     { bg: "#fee2e2", color: "#991b1b" },
};

function getStatutStyle(statut) {
  return STATUT_STYLE[statut] || { bg: "#f1f5f9", color: "#475569" };
}

// ── Composant principal ───────────────────────────────────────────────
export default function PrescriptionMedical() {
  const { numero } = useParams();

  const [prescriptions, setPrescriptions]   = useState([]);
  const [stockItems, setStockItems]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [showForm, setShowForm]             = useState(false);
  const [showHistory, setShowHistory]       = useState(true);
  const [isModifying, setIsModifying]       = useState(false);
  const [editingId, setEditingId]           = useState(null);
  const [detailItem, setDetailItem]         = useState(null);
  const [formData, setFormData]             = useState(INITIAL_FORM);
  const [searchTerm, setSearchTerm]         = useState("");

  // ── Chargement initial ──────────────────────────────────────────────
  useEffect(() => {
    if (!numero) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [presRes, stockRes] = await Promise.all([
          getPrescriptionsByNumeroDossier(numero),
          getStockMedicaments(),
        ]);
        setPrescriptions(presRes.prescriptions || []);
        setStockItems(stockRes.items || []);
      } catch (err) {
        alertError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [numero]);

  // ── Médicament sélectionné (pour l'info stock) ──────────────────────
  const selectedMed = useMemo(
    () => stockItems.find((s) => String(s.id) === String(formData.medicament_id)),
    [stockItems, formData.medicament_id]
  );

  // ── Filtrage par recherche (traitement ou statut) ───────────────────
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return prescriptions;
    const q = searchTerm.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.traitement?.toLowerCase().includes(q) ||
        p.statut?.toLowerCase().includes(q) ||
        p.posologie?.toLowerCase().includes(q)
    );
  }, [prescriptions, searchTerm]);

  // ── Helpers formulaire ──────────────────────────────────────────────
  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setIsModifying(false);
    setEditingId(null);
  };

  const openCreate = () => {
    setDetailItem(null);
    resetForm();
    setShowForm(true);
  };

  const closeForm = (notify = true) => {
    resetForm();
    setShowForm(false);
    if (notify) toast.info("Opération annulée");
  };

  // ── Sélection médicament dans le dropdown ───────────────────────────
  const handleMedSelect = (e) => {
    const id = e.target.value;
    const med = stockItems.find((s) => String(s.id) === String(id));
    setFormData((prev) => ({
      ...prev,
      medicament_id: id,
      traitement: med ? (med.code || med.composition || "") : "",
    }));
  };

  // ── Ouvrir modification ─────────────────────────────────────────────
  const openEdit = async (item) => {
    const ok = await confirmAction(
      "Modifier cette prescription ?",
      `Médicament : ${item.traitement || "-"} — Date : ${item.date ? item.date.slice(0, 10) : "-"}`,
    );
    if (!ok) { toast.info("Opération annulée"); return; }

    setDetailItem(null);
    setIsModifying(true);
    setEditingId(item.id);
    setFormData({
      medicament_id: String(item.medicament_id || ""),
      traitement:    item.traitement    || "",
      posologie:     item.posologie     || "",
      date:          item.date ? item.date.slice(0, 10) : "",
      quantite:      item.quantite      || "",
      dosage:        item.dosage        || "",
      remarque:      item.remarque      || "",
    });
    setShowForm(true);
    toast.info("Mode modification activé");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Détail ──────────────────────────────────────────────────────────
  const handleShowDetails = (item) => {
    setShowForm(false);
    resetForm();
    setDetailItem(item);
    toast.info("Mode détails actif");
  };

  // ── Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.medicament_id) {
      toast.warning("Veuillez sélectionner un médicament.");
      return;
    }
    if (!formData.date) {
      toast.warning("La date est obligatoire.");
      return;
    }
    const ok = await confirmAction(
      isModifying ? "Enregistrer les modifications ?" : "Créer cette prescription ?",
      "Les données seront enregistrées dans le dossier patient.",
    );
    if (!ok) { toast.info("Opération annulée"); return; }

    try {
      setSaving(true);
      if (isModifying) {
        const { statut: _s, ...formWithoutStatut } = formData;
        const res = await updatePrescription(editingId, {
          ...formWithoutStatut,
          numero_dossier: numero,
        });
        setPrescriptions((prev) =>
          prev.map((p) => (p.id === editingId ? res.prescription : p))
        );
        toast.success("Prescription mise à jour.");
      } else {
        const { statut: _s2, ...formWithoutStatut2 } = formData;
        const res = await createPrescription({
          ...formWithoutStatut2,
          numero_dossier: numero,
        });
        setPrescriptions((prev) => [res.prescription, ...prev]);
        toast.success("Prescription créée avec succès.");
      }
      closeForm(false);
    } catch (err) {
      alertError(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };



  // ── Rendu ─────────────────────────────────────────────────────────
  return (
    <div className="ec-page-bg pe-page">

      {/* Header + toolbar */}
      <PageHeader title="Prescription médicale" />

      <div className="pe-toolbar">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un médicament, .."
          wrapperClassName="pe-search"
        />
        {!showForm ? (
          <ActionButton action="add" label="Ajouter" size="sm" onClick={openCreate} />
        ) : (
          <ActionButton action="annuler" label="Annuler" size="sm" onClick={closeForm} />
        )}
      </div>

      {/* ── Formulaire ajout / modification ── */}
      {showForm && (
        <FormulaireWrapper
          isModifying={isModifying}
          labelCreate="Nouvelle prescription médicale"
          labelModify="Modifier la prescription"
        >
          <form onSubmit={handleSubmit}>
            <div className="pe-form-grid">

              {/* Médicament (dropdown stock) */}
              <div className="pe-col-span-2">
                <FieldLabel required>Médicament (stock)</FieldLabel>
                <select
                  className="pe-select form-select"
                  value={formData.medicament_id}
                  onChange={handleMedSelect}
                  required
                >
                  <option value="">-- Sélectionner un médicament --</option>
                  {stockItems.map((med) => (
                    <option key={med.id} value={med.id}>
                      {med.code ? `[${med.code}]` : ""} {med.composition || med.nom || "Médicament"} — Stock : {med.quantite ?? med.quantity ?? 0}
                    </option>
                  ))}
                </select>
                {/* Info stock sous le dropdown */}
                {selectedMed && (
                  <p className={`pe-stock-hint ${(selectedMed.quantite ?? selectedMed.quantity ?? 0) === 0 ? "alerte" : ""}`}>
                    {(selectedMed.quantite ?? selectedMed.quantity ?? 0) === 0
                      ? "⚠ Rupture de stock — médicament indisponible"
                      : `Quantité disponible : ${selectedMed.quantite ?? selectedMed.quantity}`}
                  </p>
                )}
              </div>

              {/* Posologie */}
              <div>
                <FieldLabel required>Posologie</FieldLabel>
                <Input
                  value={formData.posologie}
                  onChange={field("posologie")}
                  placeholder="Ex : 1 comprimé matin et soir"
                />
              </div>

              {/* Dosage */}
              <div>
                <FieldLabel>Dosage</FieldLabel>
                <Input
                  value={formData.dosage}
                  onChange={field("dosage")}
                  placeholder="Ex : 500 mg"
                />
              </div>

              {/* Date */}
              <div>
                <FieldLabel required>Date de prescription</FieldLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={field("date")}
                />
              </div>

              {/* Quantité */}
              <div>
                <FieldLabel required>Quantité prescrite</FieldLabel>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantite}
                  onChange={field("quantite")}
                  placeholder="Ex : 30"
                />
              </div>



              {/* Remarque */}
              <div className="pe-col-span-2">
                <FieldLabel>Remarque</FieldLabel>
                <textarea
                  className="pe-textarea form-control"
                  rows={3}
                  value={formData.remarque}
                  onChange={field("remarque")}
                  placeholder="Observations ou instructions complémentaires (optionnel)"
                />
              </div>
            </div>

            <div className="pe-form-actions">
              <ActionButton
                action="annuler"
                label="Annuler"
                size="sm"
                onClick={closeForm}
                type="button"
              />
              <ActionButton
                action="save"
                label={isModifying ? "Mettre à jour" : "Enregistrer"}
                loading={saving}
                size="sm"
                showIcon={false}
                type="submit"
              />
            </div>
          </form>
        </FormulaireWrapper>
      )}

      {/* ── Historique ── */}
      <HistoriqueAccordeon
        title="Historique des prescriptions médicales"
        count={filtered.length}
        open={showHistory}
        onToggle={() => setShowHistory((v) => !v)}
      >
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState message="Aucune prescription enregistrée." />
        ) : (
          <HistoriqueTable
            headers={["Date", "Médicament", "Posologie", "Dosage", "Qté", "Statut", "Action"]}
            items={filtered}
            emptyMessage="Aucune prescription enregistrée."
            renderRow={(p) => (
              <tr key={p.id}>
                <td>{toFrDate(p.date)}</td>
                <td className="fw-semibold">{p.traitement || "-"}</td>
                <td>{p.posologie || "-"}</td>
                <td>{p.dosage || "-"}</td>
                <td>{p.quantite || "-"}</td>
                <td>
                  <Badge
                    bg={getStatutStyle(p.statut).bg}
                    color={getStatutStyle(p.statut).color}
                  >
                    {STATUT_LABELS[p.statut] || p.statut}
                  </Badge>
                </td>
                <td>
                  <HistoriqueActions
                    onDetails={() => handleShowDetails(p)}
                    onEdit={() => openEdit(p)}
                  />
                </td>
              </tr>
            )}
          />
        )}
      </HistoriqueAccordeon>

      {/* ── Détail (readonly) ── */}
      {detailItem && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Détails de la prescription"
          labelModify="Détails de la prescription"
        >
          <div className="pe-detail-grid">
            <div>
              <FieldLabel>Médicament</FieldLabel>
              <Input value={detailItem.traitement || "-"} disabled />
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
              <FieldLabel>Dosage</FieldLabel>
              <Input value={detailItem.dosage || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Quantité prescrite</FieldLabel>
              <Input value={detailItem.quantite || "-"} disabled />
            </div>
            <div>
              <FieldLabel>Statut</FieldLabel>
              <Input value={STATUT_LABELS[detailItem.statut] || detailItem.statut || "-"} disabled />
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
              onClick={() => {
                setDetailItem(null);
                toast.info("Opération annulée");
              }}
            />
          </div>
        </FormulaireWrapper>
      )}

    </div>
  );
}