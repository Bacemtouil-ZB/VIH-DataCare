import { useState }  from "react";
import { ActionButton } from "../../../../shared/components/UI/Button/ActionButton";
import useContacts  from "./useContacts";
import { ModalForm, TableauContacts } from "./ContactsUrgenceUI";
import { FORM_VIDE }  from "./constants";
import { confirmDelete, confirmAction } from "../../../../shared/utils/uiAlerts.js";
import "./contactsUrgence.css";

export default function ContactsUrgencePage() {
  const { contacts, loading, saving, error, ajouter, modifier, supprimer } = useContacts();

  const [modal, setModal] = useState(null);

  const ouvrirAjout  = () => setModal({ type: "add" });
  const ouvrirEdit   = (contact) => setModal({ type: "edit", contact });
  const fermer       = () => setModal(null);

  const handleSave = async (form) => {
    if (modal.type === "edit") {
      const confirmed = await confirmAction(
        "Modifier ce contact ?",
        "Les nouvelles informations seront enregistrées."
      );
      if (!confirmed) return;
    }
    let ok;
    if (modal.type === "add")  ok = await ajouter(form);
    if (modal.type === "edit") ok = await modifier(modal.contact.id, form);
    if (ok) fermer();
  };

  const handleDelete = async (contact) => {
    const confirmed = await confirmDelete(
      "Supprimer ce contact ?",
      `Le contact <strong>${contact.nom}</strong> sera définitivement supprimé.`
    );
    if (!confirmed) return;
    await supprimer(contact.id);
  };

  return (
    <div className="urg-page">

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="urg-title">
            <i className="bi bi-telephone-plus me-2"></i>
            Contacts d'urgence
          </h1>
          <p className="urg-subtitle">Gérez les contacts affichés aux patients dans l'application mobile</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <ActionButton action="add" label="Nouveau contact" onClick={ouvrirAjout} />
        </div>
      </div>

      {/* ── Erreur chargement ── */}
      {error && (
        <div className="urg-alert urg-alert-error mb-3">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </div>
      )}

      {/* ── Tableau ── */}
      <div className="urg-card">
        <TableauContacts
          contacts={contacts}
          loading={loading}
          onEdit={ouvrirEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Modal Formulaire ── */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <ModalForm
          mode={modal.type}
          initial={modal.contact ?? FORM_VIDE}
          onSave={handleSave}
          onClose={fermer}
          saving={saving}
        />
      )}

    </div>
  );
}