// ============================================================
//  DrawerApercu.jsx
//  Zone 3 — Aperçu complet d'un bilan au clic de ligne
//  Reçoit: row=object open=boolean onClose=()=>void
// ============================================================

import { Drawer, Descriptions, Tag, Divider } from "antd";
import {
  formatDate,
  formatCD4,
  formatCV,
  formatHGB,
  getCD4AntColor,
  getCVAntColor,
  getHGBAntColor,
  getDureeTraitement,
} from "../../helpers/suiviHelpers";
import {
  COULEURS_STATUT,
  COULEURS_TYPE_BILAN,
  UNITES,
} from "../../constants/suiviConstants";

const DrawerApercu = ({ row, open, onClose }) => {
  if (!row) return null;

  return (
    <Drawer
      title="Détail du bilan"
      placement="right"
      width={480}
      open={open}
      onClose={onClose}
    >
      {/* ── En-tête statut ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Tag color={COULEURS_STATUT[row.statut] ?? "default"} style={{ fontSize: 14, padding: "4px 12px" }}>
          {row.statut ?? "Inconnu"}
        </Tag>
        <Tag color={COULEURS_TYPE_BILAN[row.type_bilan] ?? "default"}>
          {row.type_bilan}
        </Tag>
      </div>

      {/* ── Biologie principale ── */}
      <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13 }}>
        Biologie clé
      </Divider>
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="Date CD4">
          {formatDate(row.date_cd4)}
        </Descriptions.Item>
        <Descriptions.Item label="Date CV">
          {formatDate(row.date_cv)}
        </Descriptions.Item>
        <Descriptions.Item label={`CD4 (${UNITES.CD4})`}>
          <span style={{ color: `var(--ant-color-${getCD4AntColor(row.cd4_absolu)})`, fontWeight: 500 }}>
            {formatCD4(row.cd4_absolu)}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="CD4 %">
          {row.cd4_pourcent ? `${row.cd4_pourcent} %` : "---"}
        </Descriptions.Item>
        <Descriptions.Item label={`CV (${UNITES.CV})`}>
          <span style={{ color: `var(--ant-color-${getCVAntColor(row.charge_virale_valeur)})`, fontWeight: 500 }}>
            {formatCV(row.charge_virale_valeur)}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={`HGB (${UNITES.HGB})`}>
          <span style={{ color: `var(--ant-color-${getHGBAntColor(row.hemoglobine)})` }}>
            {formatHGB(row.hemoglobine)}
          </span>
        </Descriptions.Item>
      </Descriptions>

      {/* ── Bilan complémentaire ── */}
      <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, marginTop: 20 }}>
        Bilan complémentaire
      </Divider>
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label={`Plaquettes (${UNITES.PLAQUETTES})`}>
          {row.plaquettes ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label={`Globules blancs`}>
          {row.globules_blancs ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label={`Lymphocytes (${UNITES.LYMPHOCYTES})`}>
          {row.lymphocytes ?? "---"}
        </Descriptions.Item>
      </Descriptions>

      {/* ── Traitement ARV ── */}
      {row.traitement && (
        <>
          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, marginTop: 20 }}>
            Traitement ARV
          </Divider>
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Médicament">
              {row.traitement}
            </Descriptions.Item>
            <Descriptions.Item label="Code">
              {row.traitement_code ?? "---"}
            </Descriptions.Item>
            <Descriptions.Item label="Début">
              {formatDate(row.traitement_date_debut)}
            </Descriptions.Item>
            <Descriptions.Item label="Fin">
              {row.traitement_date_fin
                ? formatDate(row.traitement_date_fin)
                : <Tag color="green">En cours</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Durée">
              {getDureeTraitement(row.traitement_date_debut, row.traitement_date_fin)}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}

      {/* ── Observations ── */}
      {row.observations && (
        <>
          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, marginTop: 20 }}>
            Observations
          </Divider>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
            {row.observations}
          </p>
        </>
      )}
    </Drawer>
  );
};

export default DrawerApercu;