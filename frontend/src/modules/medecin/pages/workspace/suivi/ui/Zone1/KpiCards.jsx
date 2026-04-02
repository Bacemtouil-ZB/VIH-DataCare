// ============================================================
//  KpiCards.jsx
//  Zone 1 — Cards KPIs : CD4 · CV · Hémoglobine · Statut
//  Reçoit: kpis = { cd4, cv, hemoglobine, statut, alertes }
//          loading = boolean
// ============================================================

import { Card, Row, Col, Statistic, Tag, Spin, Empty } from "antd";
import {
  formatCD4,
  formatCV,
  formatHGB,
  formatDate,
  getCD4AntColor,
  getCVAntColor,
  getHGBAntColor,
} from "../../helpers/suiviHelpers";
import {
  COULEURS_STATUT,
  UNITES,
  MESSAGES_VIDES,
} from "../../constants/suiviConstants";

const KpiCards = ({ kpis, loading }) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!kpis || (!kpis.cd4?.valeur && !kpis.cv?.valeur && !kpis.hemoglobine?.valeur)) {
    return <Empty description={MESSAGES_VIDES.kpis} />;
  }

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>

      {/* ── CD4 ── */}
      <Col xs={24} sm={12} lg={6}>
        <Card size="small" variant="outlined">
          <Statistic
            title="CD4 absolu"
            value={formatCD4(kpis.cd4?.valeur)}
            suffix={kpis.cd4?.valeur ? UNITES.CD4 : ""}
            valueStyle={{ color: `var(--ant-color-${getCD4AntColor(kpis.cd4?.valeur)})` }}
          />
          {kpis.cd4?.pourcent && (
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>
              {kpis.cd4.pourcent} %
            </div>
          )}
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>
            {formatDate(kpis.cd4?.date)}
          </div>
          {kpis.cd4?.traitement && (
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>
              {kpis.cd4.traitement}
            </div>
          )}
        </Card>
      </Col>

      {/* ── Charge virale ── */}
      <Col xs={24} sm={12} lg={6}>
        <Card size="small" variant="outlined">
          <Statistic
            title="Charge virale"
            value={formatCV(kpis.cv?.valeur)}
            suffix={kpis.cv?.valeur >= 200 ? UNITES.CV : ""}
            valueStyle={{ color: `var(--ant-color-${getCVAntColor(kpis.cv?.valeur)})` }}
          />
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>
            {formatDate(kpis.cv?.date)}
          </div>
          {kpis.cv?.traitement && (
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>
              {kpis.cv.traitement}
            </div>
          )}
        </Card>
      </Col>

      {/* ── Hémoglobine ── */}
      <Col xs={24} sm={12} lg={6}>
        <Card size="small" variant="outlined">
          <Statistic
            title="Hémoglobine"
            value={formatHGB(kpis.hemoglobine?.valeur)}
            suffix={kpis.hemoglobine?.valeur ? UNITES.HGB : ""}
            valueStyle={{ color: `var(--ant-color-${getHGBAntColor(kpis.hemoglobine?.valeur)})` }}
          />
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>
            {formatDate(kpis.hemoglobine?.date)}
          </div>
        </Card>
      </Col>

      {/* ── Statut global ── */}
      <Col xs={24} sm={12} lg={6}>
        <Card size="small" variant="outlined">
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 8 }}>
            Statut global
          </div>
          <Tag
            color={COULEURS_STATUT[kpis.statut] ?? "default"}
            style={{ fontSize: 16, padding: "4px 16px" }}
          >
            {kpis.statut ?? "Inconnu"}
          </Tag>
          {kpis.cd4?.traitement && (
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 12 }}>
              ARV actuel
            </div>
          )}
          {kpis.cd4?.traitement && (
            <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>
              {kpis.cd4.traitement}
            </div>
          )}
        </Card>
      </Col>

    </Row>
  );
};

export default KpiCards;