// ============================================================
//  KpiCards.jsx
// ============================================================

import { Row, Col, Spin, Empty, Tag } from "antd";
import {
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  SafetyOutlined,
  CalendarOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import {
  formatCD4,
  formatCV,
  formatCreatinine,
  formatDate,
  getCD4HexColor,
  getCreatinineAntColor,
  getCVAntColor,
} from "../../helpers/suiviHelpers";
import {
  COULEURS_STATUT,
  COULEURS_STATUT_HEX,
  STATUTS,
  UNITES,
  MESSAGES_VIDES,
} from "../../constants/suiviConstants";

// ── Tendance ──────────────────────────────────────────────────
const Tendance = ({ actuel, precedent, inverse = false }) => {
  if (actuel == null || precedent == null) return null;
  if (actuel === precedent)
    return <MinusOutlined style={{ fontSize: 11, color: "#aaa" }} />;
  const hausse  = actuel > precedent;
  const positif = inverse ? !hausse : hausse;
  return positif
    ? <RiseOutlined style={{ fontSize: 11, color: COULEURS_STATUT_HEX[STATUTS.BON] }} />
    : <FallOutlined  style={{ fontSize: 11, color: COULEURS_STATUT_HEX[STATUTS.CRITIQUE] }} />;
};

// ── Composant card partagé ────────────────────────────────────
const KpiCard = ({ icon, iconBg, label, value, valueColor, unite, pourcent, rows, tag }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #EBEBEB",
    borderRadius: 12,
    padding: "14px 18px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  }}>

    {/* ── Header : icône + label ── */}
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    }}>
      <div style={{
        width: 32, height: 32,
        borderRadius: 8,
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#777", letterSpacing: "0.02em" }}>
        {label}
      </span>
    </div>

    {/* ── Valeur principale + % inline ── */}
    <div style={{
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginBottom: 10,
      flexWrap: "wrap",
    }}>
      {tag ? tag : (
        <>
          <span style={{ fontSize: 24, fontWeight: 700, color: valueColor, lineHeight: 1 }}>
            {value}
          </span>
          {unite && (
            <span style={{ fontSize: 11, color: "#bbb" }}>{unite}</span>
          )}
          {pourcent != null && (
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: valueColor,
              background: "#F0F7FF",
              border: "1px solid #D6EAFF",
              borderRadius: 4,
              padding: "1px 6px",
              marginLeft: 2,
            }}>
              {pourcent} %
            </span>
          )}
        </>
      )}
    </div>

    {/* ── Lignes infos ── */}
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 6,
      paddingTop: 10,
      borderTop: "1px solid #F5F5F5",
      flex: 1,
    }}>
      {rows.map((row, i) =>
        row ? (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}>
            {/* icône + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <span style={{ color: "#C8C8C8", fontSize: 12, display: "flex" }}>
                {row.icon}
              </span>
              <span style={{ fontSize: 12, color: "#AAA" }}>{row.label}</span>
            </div>
            {/* valeur */}
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: row.color ?? "#555",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}>
              {row.extra}{row.value}
            </span>
          </div>
        ) : (
          <div key={i} style={{ height: 16 }} />
        )
      )}
    </div>

  </div>
);

// ── Composant principal ───────────────────────────────────────
const KpiCards = ({ kpis, loading }) => {
  if (loading) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <Spin size="large" />
    </div>
  );

  if (!kpis || (!kpis.cd4?.valeur && !kpis.cv?.valeur && !kpis.creatinine?.valeur))
    return <Empty description={MESSAGES_VIDES.kpis} />;

  // ── Couleurs dynamiques ───────────────────────────────────
  const cd4Color = getCD4HexColor(kpis.cd4?.valeur);

  const cvKey    = getCVAntColor(kpis.cv?.valeur);
  const cvColor  = cvKey === "success" ? COULEURS_STATUT_HEX[STATUTS.BON]
                 : cvKey === "warning" ? COULEURS_STATUT_HEX[STATUTS.MOYEN]
                 : cvKey === "error"   ? COULEURS_STATUT_HEX[STATUTS.CRITIQUE]
                 : COULEURS_STATUT_HEX[STATUTS.INCONNU];

  const creatKey   = getCreatinineAntColor(kpis.creatinine?.valeur);
  const creatColor = creatKey === "success" ? COULEURS_STATUT_HEX[STATUTS.BON]
                   : creatKey === "warning" ? COULEURS_STATUT_HEX[STATUTS.MOYEN]
                   : creatKey === "error"   ? COULEURS_STATUT_HEX[STATUTS.CRITIQUE]
                   : COULEURS_STATUT_HEX[STATUTS.INCONNU];

  return (
    <Row gutter={[12, 12]} style={{ marginBottom: 16 }} align="stretch">

      {/* ── CD4 ── */}
      <Col xs={24} sm={12} lg={6} style={{ display: "flex" }}>
        <KpiCard
          icon={<HeartOutlined style={{ color: "#378ADD", fontSize: 15 }} />}
          iconBg="#E6F1FB"
          label="CD4 absolu"
          value={formatCD4(kpis.cd4?.valeur)}
          valueColor={cd4Color}
          unite={UNITES.CD4}
          pourcent={kpis.cd4?.pourcent ?? null}
          rows={[
            kpis.cd4?.date ? {
              icon:  <CalendarOutlined />,
              label: "Dernière mesure",
              value: formatDate(kpis.cd4.date),
            } : null,
            kpis.cd4?.precedent != null ? {
              icon:  <LineChartOutlined />,
              label: "Précédent",
              value: formatCD4(kpis.cd4.precedent),
              extra: <Tendance actuel={kpis.cd4.valeur} precedent={kpis.cd4.precedent} />,
            } : null,
            null,
          ]}
        />
      </Col>

      {/* ── Charge virale ── */}
      <Col xs={24} sm={12} lg={6} style={{ display: "flex" }}>
        <KpiCard
          icon={<ThunderboltOutlined style={{ color: "#E24B4A", fontSize: 15 }} />}
          iconBg="#FCEBEB"
          label="Charge virale"
          value={formatCV(kpis.cv?.valeur)}
          valueColor={cvColor}
          unite={kpis.cv?.valeur >= 200 ? UNITES.CV : ""}
          rows={[
            kpis.cv?.date ? {
              icon:  <CalendarOutlined />,
              label: "Dernière mesure",
              value: formatDate(kpis.cv.date),
            } : null,
            kpis.cv?.precedent != null ? {
              icon:  <LineChartOutlined />,
              label: "Précédent",
              value: formatCV(kpis.cv.precedent),
              extra: <Tendance actuel={kpis.cv.valeur} precedent={kpis.cv.precedent} inverse />,
            } : null,
            null,
          ]}
        />
      </Col>

      {/* ── Créatinine ── */}
      <Col xs={24} sm={12} lg={6} style={{ display: "flex" }}>
        <KpiCard
          icon={<ExperimentOutlined style={{ color: "#1D9E75", fontSize: 15 }} />}
          iconBg="#E1F5EE"
          label="Créatinine"
          value={formatCreatinine(kpis.creatinine?.valeur)}
          valueColor={creatColor}
          unite={UNITES.CREATININE}
          rows={[
            kpis.creatinine?.date ? {
              icon:  <CalendarOutlined />,
              label: "Dernière mesure",
              value: formatDate(kpis.creatinine.date),
            } : null,
            null,
            null,
          ]}
        />
      </Col>

      {/* ── Statut global ── */}
      <Col xs={24} sm={12} lg={6} style={{ display: "flex" }}>
        <KpiCard
          icon={<SafetyOutlined style={{ color: "#7F77DD", fontSize: 15 }} />}
          iconBg="#EEEDFE"
          label="Statut global"
          tag={
            <Tag
              color={COULEURS_STATUT[kpis.statut] ?? "default"}
              style={{
                fontSize: 15,
                padding: "4px 14px",
                borderRadius: 6,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {kpis.statut ?? "Inconnu"}
            </Tag>
          }
          rows={[
            kpis.cd4?.traitement ? {
              icon:  <SafetyOutlined />,
              label: "ARV actuel",
              value: kpis.cd4.traitement,
              color: "#7F77DD",
            } : null,
            null,
            null,
          ]}
        />
      </Col>

    </Row>
  );
};

export default KpiCards;