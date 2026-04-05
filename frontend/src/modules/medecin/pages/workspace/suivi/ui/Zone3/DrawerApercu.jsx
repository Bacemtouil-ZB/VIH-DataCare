// import { Drawer, Descriptions, Tag, Divider } from "antd";
// import {
//   formatDate,
//   formatCreatinine,        // ✅
//   getCreatinineAntColor,   // ✅
//   getDureeTraitement,
// } from "../../helpers/suiviHelpers";
// import {
//   COULEURS_TYPE_BILAN,
//   UNITES,
// } from "../../constants/suiviConstants";

// const DrawerApercu = ({ row, open, onClose }) => {
//   if (!row) return null;

//   return (
//     <Drawer
//       title="Détail du bilan"
//       placement="right"
//       width={480}
//       open={open}
//       onClose={onClose}
//     >
//       {/* ── Type bilan ── */}
//       <div style={{ marginBottom: 20 }}>
//         <Tag color={COULEURS_TYPE_BILAN[row.type_bilan] ?? "default"}>
//           {row.type_bilan}
//         </Tag>
//       </div>

//       {/* ── CD4 % + Créatinine ── */}
//       <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13 }}>
//         Biologie complémentaire
//       </Divider>
//       <Descriptions column={2} size="small" bordered>
//         <Descriptions.Item label="CD4 %">
//           {row.cd4_pourcent ? `${row.cd4_pourcent} %` : "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label={`Créatinine (${UNITES.CREATININE})`}>
//           <span style={{ color: `var(--ant-color-${getCreatinineAntColor(row.creatinine)})` }}>
//             {formatCreatinine(row.creatinine)}
//           </span>
//         </Descriptions.Item>
//         <Descriptions.Item label={`Plaquettes (${UNITES.PLAQUETTES})`}>
//           {row.plaquettes ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Globules blancs">
//           {row.globules_blancs ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label={`Lymphocytes (${UNITES.LYMPHOCYTES})`}>
//           {row.lymphocytes ?? "---"}
//         </Descriptions.Item>
//       </Descriptions>

//       {/* ── Bilan sérologique ── */}
//       <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, marginTop: 20 }}>
//         Sérologie
//       </Divider>
//       <Descriptions column={2} size="small" bordered>
//         <Descriptions.Item label="VHB AgHBs">
//           {row.vhb_ag_hbs ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="VHB Ac HBs">
//           {row.vhb_ac_hbs ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="VHB Ac HBc">
//           {row.vhb_ac_hbc ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="VHC">
//           {row.vhc ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="VHA IgG">
//           {row.vha_igg ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Toxo IgG">
//           {row.toxo_igg ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Toxo IgM">
//           {row.toxo_igm ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="CMV IgG">
//           {row.cmv_igg ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="CMV IgM">
//           {row.cmv_igm ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="VDRL">
//           {row.vdrl ?? "---"}
//         </Descriptions.Item>
//         <Descriptions.Item label="TPHA">
//           {row.tpha ?? "---"}
//         </Descriptions.Item>
//       </Descriptions>

//       {/* ── Traitement ARV durée uniquement ── */}
//       {row.traitement && (
//         <>
//           <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, marginTop: 20 }}>
//             Durée traitement ARV
//           </Divider>
//           <Descriptions column={1} size="small" bordered>
//             <Descriptions.Item label="Début">
//               {formatDate(row.traitement_date_debut)}
//             </Descriptions.Item>
//             <Descriptions.Item label="Fin">
//               {row.traitement_date_fin
//                 ? formatDate(row.traitement_date_fin)
//                 : <Tag color="green">En cours</Tag>}
//             </Descriptions.Item>
//             <Descriptions.Item label="Durée">
//               {getDureeTraitement(row.traitement_date_debut, row.traitement_date_fin)}
//             </Descriptions.Item>
//           </Descriptions>
//         </>
//       )}

//       {/* ── Observations ── */}
//       {row.observations && (
//         <>
//           <Divider orientation="left" orientationMargin={0} style={{ fontSize: 13, marginTop: 20 }}>
//             Observations
//           </Divider>
//           <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
//             {row.observations}
//           </p>
//         </>
//       )}
//     </Drawer>
//   );
// };

// export default DrawerApercu;

import { Drawer, Descriptions, Tag, Divider } from "antd";
import {
  formatDate,
  getDureeTraitement,
} from "../../helpers/suiviHelpers";
import {
  COULEURS_TYPE_BILAN,
  UNITES,
} from "../../constants/suiviConstants";

// ── Helpers ───────────────────────────────────────────────
const hasVal = (v) => v !== null && v !== undefined && v !== "";

// retourne "-" si vide
const display = (v) => (hasVal(v) ? v : "-");

const hasSection = (row, champs) =>
  champs.some((c) => hasVal(row[c]));

// ── Item ──────────────────────────────────────────────────
const DescItem = ({ label, value, render }) => {
  return (
    <Descriptions.Item label={label}>
      {hasVal(value)
        ? render
          ? render(value)
          : value
        : "-"}
    </Descriptions.Item>
  );
};

// ── Section ───────────────────────────────────────────────
const Section = ({ titre, row, champs, children }) => {
  if (!hasSection(row, champs)) return null;

  return (
    <>
      <Divider
        titlePlacement="left"
        styles={{ content: { margin: 0 } }}
        style={{ fontSize: 13, marginTop: 20 }}
      >
        {titre}
      </Divider>

      <Descriptions column={2} size="small" bordered>
        {children}
      </Descriptions>
    </>
  );
};

// ── Main Component ────────────────────────────────────────
const DrawerApercu = ({ row, open, onClose }) => {
  if (!row) return null;

  return (
    <Drawer
      title="Détail du bilan"
      placement="right"
      size="large"
      open={open}
      onClose={onClose}
    >
      {/* Type bilan */}
      <div style={{ marginBottom: 20 }}>
        <Tag color={COULEURS_TYPE_BILAN[row.type_bilan] ?? "default"}>
          {display(row.type_bilan)}
        </Tag>
      </div>

      {/* Hématologie */}
      <Section
        titre="Hématologie"
        row={row}
        champs={["cd4_pourcent", "plaquettes", "globules_blancs", "lymphocytes"]}
      >
        <DescItem label="CD4 %" value={row.cd4_pourcent} render={(v) => `${v} %`} />
        <DescItem label={`Plaquettes (${UNITES.PLAQUETTES})`} value={row.plaquettes} />
        <DescItem label="Globules blancs" value={row.globules_blancs} />
        <DescItem label={`Lymphocytes (${UNITES.LYMPHOCYTES})`} value={row.lymphocytes} />
      </Section>

      {/* Biochimie */}
      <Section
        titre="Biochimie"
        row={row}
        champs={["asat", "alat", "phosphore", "calcemie"]}
      >
        <DescItem label="ASAT" value={row.asat} />
        <DescItem label="ALAT" value={row.alat} />
        <DescItem label="Phosphore" value={row.phosphore} />
        <DescItem label="Calcémie" value={row.calcemie} />
      </Section>

      {/* Lipides */}
      <Section
        titre="Bilan lipidique"
        row={row}
        champs={["cholesterol_total", "hdl", "ldl", "triglycerides"]}
      >
        <DescItem label="Cholestérol total" value={row.cholesterol_total} />
        <DescItem label="HDL" value={row.hdl} />
        <DescItem label="LDL" value={row.ldl} />
        <DescItem label="Triglycérides" value={row.triglycerides} />
      </Section>

      {/* VHB */}
      <Section
        titre="Sérologie VHB"
        row={row}
        champs={["vhb_ag_hbs", "vhb_ac_hbs", "vhb_ac_hbc"]}
      >
        <DescItem label="AgHBs" value={row.vhb_ag_hbs} />
        <DescItem label="Ac HBs" value={row.vhb_ac_hbs} />
        <DescItem label="Ac HBc" value={row.vhb_ac_hbc} />
      </Section>

      {/* Sérologie */}
      <Section
        titre="Sérologie"
        row={row}
        champs={[
          "vhc", "vha_igg",
          "toxo_igg", "toxo_igm",
          "cmv_igg", "cmv_igm",
          "vdrl", "tpha",
          "leishmania_ac", "idr_tuberculine",
        ]}
      >
        <DescItem label="VHC" value={row.vhc} />
        <DescItem label="VHA IgG" value={row.vha_igg} />
        <DescItem label="Toxo IgG" value={row.toxo_igg} />
        <DescItem label="Toxo IgM" value={row.toxo_igm} />
        <DescItem label="CMV IgG" value={row.cmv_igg} />
        <DescItem label="CMV IgM" value={row.cmv_igm} />
        <DescItem label="VDRL" value={row.vdrl} />
        <DescItem label="TPHA" value={row.tpha} />
        <DescItem label="Leishmania Ac" value={row.leishmania_ac} />
        <DescItem label="IDR Tuberculine" value={row.idr_tuberculine} />
      </Section>

      {/* Traitement */}
      <Section
        titre="Traitement ARV"
        row={row}
        champs={["traitement_date_debut"]}
      >
        <DescItem
          label="Début"
          value={row.traitement_date_debut}
          render={(v) => formatDate(v)}
        />
        <DescItem
          label="Fin"
          value={row.traitement_date_fin}
          render={(v) => formatDate(v)}
        />

        <Descriptions.Item label="Durée">
          {hasVal(row.traitement_date_debut)
            ? getDureeTraitement(row.traitement_date_debut, row.traitement_date_fin)
            : "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Statut">
          {hasVal(row.traitement_date_debut) ? (
            hasVal(row.traitement_date_fin) ? (
              <Tag>Terminé</Tag>
            ) : (
              <Tag color="green">En cours</Tag>
            )
          ) : (
            "-"
          )}
        </Descriptions.Item>
      </Section>

      {/* Observations */}
      <Divider
        titlePlacement="left"
        styles={{ content: { margin: 0 } }}
        style={{ fontSize: 13, marginTop: 20 }}
      >
        Observations
      </Divider>

      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
        {display(row.observations)}
      </p>
    </Drawer>
  );
};

export default DrawerApercu;