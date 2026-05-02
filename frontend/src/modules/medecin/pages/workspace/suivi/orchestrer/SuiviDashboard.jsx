import { useParams } from "react-router-dom";
import { Row, Col, Typography, Divider, Spin, Alert } from "antd";
import { useMemo } from "react";

// ── Hooks ────────────────────────────────────────────────────
import useSuiviKpis        from "../usesuivi/useSuiviKpis";
import useSuiviGraphiques  from "../usesuivi/useSuiviGraphiques";
import useSuiviTableau     from "../usesuivi/useSuiviTableau";

// ── Composants Zone 1 ────────────────────────────────────────
import AlertesBanner from "../ui/Zone1/AlertesBanner";
import KpiCards      from "../ui/Zone1/KpiCards";

// ── Composants Zone 2 ────────────────────────────────────────
import GraphiqueCD4 from "../ui/Zone2/GraphiqueCD4";
import GraphiqueCV  from "../ui/Zone2/GraphiqueCV";

// ── Composants Zone 3 ────────────────────────────────────────
import TableauSuivi from "../ui/Zone3/TableauSuivi";

const { Title } = Typography;

const SuiviDashboard = () => {
  const { numero } = useParams();

  // ── Hooks — appels parallèles automatiques ────────────────
  const { kpis,       loading: l1, error: e1 } = useSuiviKpis(numero);
  const { graphiques, loading: l2, error: e2 } = useSuiviGraphiques(numero);
  const { tableau,    loading: l3, error: e3 } = useSuiviTableau(numero);

  // ── Loading/error unifiés ─────────────────────────────────
  const loading = useMemo(() => l1 || l2 || l3, [l1, l2, l3]);
  const error   = useMemo(() => e1 || e2 || e3, [e1, e2, e3]);

  return (
    <div style={{ padding: "24px" }}>

      {loading && <Spin size="large" style={{ display: "block", textAlign: "center", margin: "24px 0" }} />}

      {error && <Alert type="error" message="Erreur" description={error} showIcon style={{ marginBottom: "16px" }} />}

      {/* ── Zone 1 — Alertes + KPIs ── */}
      <AlertesBanner alertes={kpis?.alertes} />
      <KpiCards kpis={kpis} loading={l1} />

      <Divider style={{ margin: "8px 0 20px" }} />

      {/* ── Zone 2 — Graphiques ── */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Évolution biologique
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <GraphiqueCD4
            data={graphiques.cd4}
            periodes={graphiques.periodes}
            loading={l2}
          />
        </Col>
        <Col xs={24}>
          <GraphiqueCV
            data={graphiques.cv}
            periodes={graphiques.periodes}
            loading={l2}
          />
        </Col>
      </Row>

      <Divider style={{ margin: "8px 0 20px" }} />

      {/* ── Zone 3 — Tableau ── */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Historique des bilans
      </Title>

      <TableauSuivi
        data={tableau}
        loading={l3}
      />

    </div>
  );
};

export default SuiviDashboard;