import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ActionButton,
  Badge,
  FieldLabel,
  FormulaireWrapper,
  HistoriqueAccordeon,
  HistoriqueActions,
  HistoriqueTable,
  Input,
  PageHeader,
  SearchBar,
} from "../../../../../shared/components/layouts";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import { formatDateFr, openFormForCreate, showDetailMode } from "../../../../../shared/utils/logiqueTableHistory";
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
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [isModifying, setIsModifying] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailRdv, setDetailRdv] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rendezVous, setRendezVous] = useState([
    {
      id: 1,
      date: "2026-03-10",
      heure: "09:30",
      type: "Suivi",
      statut: "Planifie",
      commentaire: "Patient stable",
      numero_dossier: numero || "F-001-2023",
    },
    {
      id: 2,
      date: "2026-03-15",
      heure: "11:00",
      type: "Biologie",
      statut: "Confirme",
      commentaire: "",
      numero_dossier: numero || "F-001-2023",
    },
  ]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rendezVous;
    return rendezVous.filter(
      (r) =>
        (r.type || "").toLowerCase().includes(q) ||
        (r.statut || "").toLowerCase().includes(q) ||
        String(r.numero_dossier).toLowerCase().includes(q),
    );
  }, [rendezVous, search]);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setIsModifying(false);
    setEditingId(null);
  };

  const openCreate = () => {
    openFormForCreate(setDetailRdv, resetForm, setShowForm);
  };

  const closeForm = (notify = true) => {
    resetForm();
    setShowForm(false);
    if (notify) toast.info("Operation annulee");
  };

  const openEdit = async (item) => {
    const ok = await confirmAction(
      "Modifier ce rendez-vous ?",
      `Date: ${new Date(item.date).toLocaleDateString("fr-FR")} - Heure: ${item.heure}`,
    );
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }

    setDetailRdv(null);
    setFormData({
      date: item.date || "",
      heure: item.heure || "",
      type: item.type || "Suivi",
      statut: item.statut || "Planifie",
      commentaire: item.commentaire || "",
    });
    setIsModifying(true);
    setEditingId(item.id);
    setShowForm(true);
    toast.info("Mode modification active");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.heure) {
      toast.error("Date et heure sont obligatoires");
      return;
    }

    const ok = await confirmAction(
      isModifying ? "Enregistrer les modifications ?" : "Creer ce rendez-vous ?",
      "Les donnees seront enregistrees dans le dossier patient.",
    );
    if (!ok) {
      toast.info("Operation annulee");
      return;
    }

    try {
      if (isModifying && editingId) {
        setRendezVous((prev) =>
          prev.map((row) =>
            row.id === editingId
              ? {
                  ...row,
                  ...formData,
                }
              : row,
          ),
        );
        toast.success("Rendez-vous mis a jour");
      } else {
        setRendezVous((prev) => [
          {
            id: Date.now(),
            ...formData,
            numero_dossier: numero || "F-001-2023",
          },
          ...prev,
        ]);
      toast.success("Rendez-vous enregistre");
      }

      closeForm(false);
    } catch (err) {
      await alertError(err?.message || "Erreur lors de l'enregistrement");
    }
  };

  const statusStyle = (status) => STATUS_COLORS[status] || { bg: "#f1f5f9", color: "#334155" };

  const handleShowDetails = (item) => {
    showDetailMode(setShowForm, setDetailRdv, item);
    toast.info("Mode details actif");
  };

  return (
    <div className="ec-page-bg rdv-page">
      <PageHeader
        title={`Gestion des rendez-vous`}
        actionButton={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            wrapperClassName="rdv-search"
          />
        }
      />

      <div className="rdv-toolbar">
        {!showForm ? (
          <ActionButton
            action="add"
            label="Ajouter"
            size="sm"
            onClick={openCreate}
          />
        ) : (
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => closeForm(true)}>
            Annuler
          </button>
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
                <Input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel required>Heure</FieldLabel>
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
                  <option value="Biologie">Biologie</option>
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
                label={isModifying ? "Mettre a jour" : "Enregistrer"}
                showIcon={false}
                size="sm"
                block={true}
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
        <HistoriqueTable
          headers={["Date", "Heure", "Type","Statut", "Action"]}
          items={filtered}
          emptyMessage="Aucun rendez-vous enregistre."
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
      </HistoriqueAccordeon>

      {detailRdv && (
        <FormulaireWrapper
          isModifying={false}
          labelCreate="Details du rendez-vous"
          labelModify="Details du rendez-vous"
        >
          <div className="ec-readonly-block">
            <div className="rdv-detail-grid">
              <div>
                <FieldLabel>Dossier</FieldLabel>
                <Input type="text" className="form-control" value={detailRdv.numero_dossier || "-"} disabled readOnly />
              </div>
              <div>
                <FieldLabel>Date</FieldLabel>
                <Input type="text" className="form-control" value={formatDateFr(detailRdv.date, "-")} disabled readOnly />
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
              <button type="button" className="btn btn-light btn-sm" onClick={() => setDetailRdv(null)}>
                Fermer
              </button>
            </div>
          </div>
        </FormulaireWrapper>
      )}
    </div>
  );
}
