import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ActionButton, Badge, FieldLabel, FormulaireWrapper, HistoriqueAccordeon,
  HistoriqueActions, HistoriqueTable, Input, PageTitle, SearchBar,
} from "../../../../../shared/components/layouts";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import { openFormForCreate, showDetailMode } from "../../../../../shared/utils/logiqueTableHistory";
import {
  createRendezvous, getRendezvousByNumeroDossier, updateRendezvous,
} from "../../../services/rendezvousService";
import { toInputDate, toInputTime, toFrDate } from "../../../../../shared/utils/dateHelpers";
import "./RendezVous.css";

const INITIAL_FORM = {
  date: "",
  heure: "",
  type: "Suivi",
  statut: "Planifie",
  commentaire: "",
};

const STATUS_COLORS = {
  Planifie: { bg: "#e0f2fe", color: "#075985" },
  Confirme: { bg: "#dcfce7", color: "#166534" },
  Annule: { bg: "#fee2e2", color: "#991b1b" },
  Termine: { bg: "#ede9fe", color: "#5b21b6" },
};

export default function RendezVous() {
  const { numero } = useParams();
  const [searchDate, setSearchDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [isModifying, setIsModifying] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailRdv, setDetailRdv] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Chargement initial ──────────────────────────────────────────────
  useEffect(() => {
    if (!numero) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getRendezvousByNumeroDossier(numero);
        setRendezVous(res.rendezvous || []);
      } catch (err) {
        toast.error(err?.message || "Erreur lors du chargement des rendez-vous");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numero]);

  // ── Filtrage ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchDate) return rendezVous;
    return rendezVous.filter((r) => toInputDate(r.date) === searchDate);
  }, [rendezVous, searchDate]);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setIsModifying(false);
    setEditingId(null);
  };

  const openCreate = () => openFormForCreate(setDetailRdv, resetForm, setShowForm);

  const closeForm = (notify = true) => {
    resetForm();
    setShowForm(false);
    if (notify) toast.info("Opération annulée");
  };

  const openEdit = async (item) => {
    const ok = await confirmAction(
      "Modifier ce rendez-vous ?",
      `Date : ${new Date(item.date).toLocaleDateString("fr-FR")} — Heure : ${item.heure}`,
    );
    if (!ok) { toast.info("Opération annulée"); return; }

    setDetailRdv(null);
    setFormData({
      date: toInputDate(item.date),
      heure: toInputTime(item.heure),
      type: item.type || "",
      statut: item.statut || "",
      commentaire: item.commentaire || "",
    });
    setIsModifying(true);
    setEditingId(item.id);
    setShowForm(true);
    toast.info("Mode modification activé");
  };

  // ── Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.heure) {
      toast.error("Date et heure sont obligatoires");
      return;
    }

    const ok = await confirmAction(
      isModifying ? "Enregistrer les modifications ?" : "Créer ce rendez-vous ?",
      "Les données seront enregistrées dans le dossier patient.",
    );
    if (!ok) { toast.info("Opération annulée"); return; }

    try {
      if (isModifying && editingId) {
        const res = await updateRendezvous(editingId, formData);
        setRendezVous((prev) =>
          prev.map((r) => (r.id === editingId ? res.rendezvous : r)),
        );
        toast.success("Rendez-vous mis à jour");
      } else {
        const res = await createRendezvous({ ...formData, numero_dossier: numero });
        setRendezVous((prev) => [res.rendezvous, ...prev]);
        toast.success("Rendez-vous enregistré");
      }
      closeForm(false);
    } catch (err) {
      await alertError(err?.message || "Erreur lors de l'enregistrement");
    }
  };

  // ── Helpers visuels ─────────────────────────────────────────────────
  const statusStyle = (status) => STATUS_COLORS[status] || { bg: "#f1f5f9", color: "#334155" };
  const handleShowDetails = (item) => {
    showDetailMode(setShowForm, setDetailRdv, item);
    toast.info("Mode détails actif");
  };

  // ── Rendu ───────────────────────────────────────────────────────────
  return (
    <div className="ec-page-bg rdv-page">
      <PageTitle title="Gestion des rendez-vous" />

      <div className="rdv-toolbar">
        <SearchBar
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          wrapperClassName="rdv-search"
        />
        {!showForm ? (
          <ActionButton action="add" label="Ajouter" size="sm" onClick={openCreate} />
        ) : (
          <ActionButton action="annuler" label="annuler" size="sm" onClick={() => closeForm()} />
        )}
      </div>

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
                <Input type="date" className="form-control" value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))} />
              </div>
              <div>
                <FieldLabel required>Heure</FieldLabel>
                <Input type="time" className="form-control" value={formData.heure}
                  onChange={(e) => setFormData((prev) => ({ ...prev, heure: e.target.value }))} />
              </div>
              <div>
                <FieldLabel>Type</FieldLabel>
                <select className="form-select" value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}>
                  <option value="Suivi">Suivi</option>
                  <option value="Biologie">Biologie</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Urgence">Urgence</option>
                </select>
              </div>
              <div>
                <FieldLabel>Statut</FieldLabel>
                <select className="form-select" value={formData.statut}
                  onChange={(e) => setFormData((prev) => ({ ...prev, statut: e.target.value }))}>
                  <option value="Planifie">Planifie</option>
                  <option value="Confirme">Confirme</option>
                  <option value="Annule">Annule</option>
                  <option value="Termine">Termine</option>
                </select>
              </div>
              <div className="rdv-col-span-2">
                <FieldLabel>Commentaire</FieldLabel>
                <textarea className="form-control" rows={3} value={formData.commentaire}
                  onChange={(e) => setFormData((prev) => ({ ...prev, commentaire: e.target.value }))}
                  placeholder="Note interne (optionnel)" />
              </div>
            </div>
            <div className="rdv-form-actions">
              <ActionButton action="save" label={isModifying ? "Mettre à jour" : "Enregistrer"}
                showIcon={false} size="sm" block={true} />
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
          <div className="text-center py-3 text-secondary">
            <span className="spinner-border spinner-border-sm me-2"></span>Chargement...
          </div>
        ) : (
          <HistoriqueTable
            headers={["Date", "Heure", "Type", "Statut", "Action"]}
            items={filtered}
            emptyMessage="Aucun rendez-vous enregistré."
            renderRow={(r) => (
              <tr key={r.id}>
                <td>{new Date(r.date).toLocaleDateString("fr-FR")}</td>
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
        <FormulaireWrapper isModifying={false} labelCreate="Détails du rendez-vous" labelModify="Détails du rendez-vous">
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
              <ActionButton action="annuler" label="Fermer" size="sm" onClick={() => {
                setDetailRdv(null);
                toast.info("Opération annulée");
              }} />
            </div>
          </div>
        </FormulaireWrapper>
      )}
    </div>
  );
}
