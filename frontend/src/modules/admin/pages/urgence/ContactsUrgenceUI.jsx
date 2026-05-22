import { useState } from "react";
import { ActionButton } from "../../../../shared/components/UI/Button/ActionButton";
import HistoriqueTable from "../../../../shared/components/UI/Table/HistoriqueTable";
import HistoriqueActions from "../../../../shared/components/UI/Button/HistoriqueActions";
import { FieldError } from "../../../../shared/components";
import { TABLE_HEADERS, FORM_VIDE } from "./constants";

export const ModalForm = ({
  mode,
  initial,
  onSave,
  onClose,
  saving,
  errors = {},
  makeFieldHandler,
}) => {
  const [form, setForm] = useState(initial ?? FORM_VIDE);

  const handle = (fieldName) => makeFieldHandler(fieldName, setForm);

  const handleSave = async () => {
    await onSave(form);
  };

  return (
    <div className="urg-modal-overlay" onClick={onClose}>
      <div className="urg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="urg-modal-header">
          <h5>
            <i className={`bi ${mode === "edit" ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
            {mode === "edit" ? "Modifier le contact" : "Nouveau contact d'urgence"}
          </h5>
          <p>{mode === "edit" ? "Modifiez les informations du contact" : "Remplissez les informations du contact"}</p>
        </div>

        <div className="urg-modal-body">
          {errors._form && (
            <div className="urg-alert urg-alert-error mb-3">
              <i className="bi bi-exclamation-circle me-2"></i>
              {errors._form}
            </div>
          )}

          <div className="mb-3">
            <label className="urg-form-label">
              Nom / Organisation <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div className="urg-input-icon">
              <i className="bi bi-building"></i>
              <input
                className={`urg-form-control ${errors.nom ? "is-invalid" : ""}`}
                placeholder="Ex: Service des urgences"
                value={form.nom}
                onChange={handle("nom")}
              />
            </div>
            <FieldError error={errors.nom} />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="urg-form-label">
                Telephone <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div className="urg-input-icon">
                <i className="bi bi-telephone"></i>
                <input
                  className={`urg-form-control ${errors.telephone ? "is-invalid" : ""}`}
                  placeholder="+216 XX XXX XXX"
                  value={form.telephone}
                  onChange={handle("telephone")}
                  
                />
              </div>
              <FieldError error={errors.telephone} />
            </div>

            <div className="col-6">
              <label className="urg-form-label">WhatsApp <span style={{ color: "#ef4444" }}>*</span> </label>
              <div className="urg-input-icon">
                <i className="bi bi-whatsapp"></i>
                <input
                  className={`urg-form-control ${errors.whatsapp ? "is-invalid" : ""}`}
                  placeholder="+216 XX XXX XXX"
                  value={form.whatsapp}
                  onChange={handle("whatsapp")}
                />
              </div>
              <FieldError error={errors.whatsapp} />
            </div>
          </div>

          <div className="mb-3">
            <label className="urg-form-label">Email</label>
            <div className="urg-input-icon">
              <i className="bi bi-envelope"></i>
              <input
                className={`urg-form-control ${errors.email ? "is-invalid" : ""}`}
                type="email"
                placeholder="contact@hopital.tn"
                value={form.email}
                onChange={handle("email")}
              />
            </div>
            <FieldError error={errors.email} />
          </div>

          <div className="mb-4">
            <label className="urg-form-label">Description / Notes</label>
            <div className="urg-input-icon">
              <i className="bi bi-chat-left-text" style={{ top: "18px" }}></i>
              <textarea
                className={`urg-form-control ${errors.description ? "is-invalid" : ""}`}
                rows={3}
                placeholder="Ex: Disponible 24h/24 pour les urgences VIH"
                value={form.description}
                onChange={handle("description")}
              />
            </div>
            <FieldError error={errors.description} />
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <ActionButton action="annuler" onClick={onClose} disabled={saving} />
            <ActionButton
              action={mode === "edit" ? "edit" : "add"}
              label={mode === "edit" ? "Modifier" : "Ajouter"}
              loading={saving}
              loadingLabel="Enregistrement..."
              onClick={handleSave}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const LigneContact = ({ contact, index, onEdit, onDelete }) => (
  <tr>
    <td className="text-muted fw-semibold">{index + 1}</td>
    <td><span className="fw-semibold text-dark">{contact.nom}</span></td>
    <td>
      {contact.telephone
        ? <span className="urg-badge-tel"><i className="bi bi-telephone-fill"></i>{contact.telephone}</span>
        : <span className="text-muted">-</span>}
    </td>
    <td>
      {contact.whatsapp
        ? <span className="urg-badge-wp"><i className="bi bi-whatsapp"></i>{contact.whatsapp}</span>
        : <span className="text-muted">-</span>}
    </td>
    <td>
      {contact.email
        ? <span className="urg-badge-email"><i className="bi bi-envelope-fill"></i>{contact.email}</span>
        : <span className="text-muted">-</span>}
    </td>
    <td style={{ maxWidth: 200 }}>
      <span className="text-muted" style={{ fontSize: "0.82rem" }}>{contact.description || "-"}</span>
    </td>
    <td>
      <HistoriqueActions onEdit={onEdit} onDelete={onDelete} />
    </td>
  </tr>
);

export const TableauContacts = ({ contacts, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="urg-empty">
        <div className="spinner-border text-success mb-3" role="status"></div>
        <p className="text-muted">Chargement des contacts...</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="urg-empty">
        <i className="bi bi-telephone-x text-muted"></i>
        <p className="fw-semibold">Aucun contact d'urgence</p>
        <p className="small">Cliquez sur "Nouveau contact" pour en ajouter un.</p>
      </div>
    );
  }

  return (
    <HistoriqueTable
      headers={TABLE_HEADERS}
      items={contacts}
      renderRow={(contact, idx) => (
        <LigneContact
          key={contact.id}
          contact={contact}
          index={idx}
          onEdit={() => onEdit(contact)}
          onDelete={() => onDelete(contact)}
        />
      )}
    />
  );
};
