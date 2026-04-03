import { Drawer, Descriptions, Tag, Divider } from "antd";
import {
  formatDate,
  formatCreatinine,        // ✅
  getCreatinineAntColor,   // ✅
  getDureeTraitement,
} from "../../helpers/suiviHelpers";
import {
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
      {/* ── Type bilan ── */}
      <div style={{ marginBottom: 20 }}>
        <Tag color={COULEURS_TYPE_BILAN[row.type_bilan] ?? "default"}>
          {row.type_bilan}
        </Tag>
      </div>

      {/* ── CD4 % + Créatinine ── */}
      <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13 }}>
        Biologie complémentaire
      </Divider>
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="CD4 %">
          {row.cd4_pourcent ? `${row.cd4_pourcent} %` : "---"}
        </Descriptions.Item>
        <Descriptions.Item label={`Créatinine (${UNITES.CREATININE})`}>
          <span style={{ color: `var(--ant-color-${getCreatinineAntColor(row.creatinine)})` }}>
            {formatCreatinine(row.creatinine)}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={`Plaquettes (${UNITES.PLAQUETTES})`}>
          {row.plaquettes ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Globules blancs">
          {row.globules_blancs ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label={`Lymphocytes (${UNITES.LYMPHOCYTES})`}>
          {row.lymphocytes ?? "---"}
        </Descriptions.Item>
      </Descriptions>

      {/* ── Bilan sérologique ── */}
      <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, marginTop: 20 }}>
        Sérologie
      </Divider>
      <Descriptions column={2} size="small" bordered>
        <Descriptions.Item label="VHB AgHBs">
          {row.vhb_ag_hbs ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="VHB Ac HBs">
          {row.vhb_ac_hbs ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="VHB Ac HBc">
          {row.vhb_ac_hbc ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="VHC">
          {row.vhc ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="VHA IgG">
          {row.vha_igg ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Toxo IgG">
          {row.toxo_igg ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Toxo IgM">
          {row.toxo_igm ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="CMV IgG">
          {row.cmv_igg ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="CMV IgM">
          {row.cmv_igm ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="VDRL">
          {row.vdrl ?? "---"}
        </Descriptions.Item>
        <Descriptions.Item label="TPHA">
          {row.tpha ?? "---"}
        </Descriptions.Item>
      </Descriptions>

      {/* ── Traitement ARV durée uniquement ── */}
      {row.traitement && (
        <>
          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, marginTop: 20 }}>
            Durée traitement ARV
          </Divider>
          <Descriptions column={1} size="small" bordered>
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