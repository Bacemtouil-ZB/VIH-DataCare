// ============================================================
//  SuiviDashboard.jsx
//  Orchestrateur principal — Zone 1 + Zone 2 + Zone 3
//  Aucune logique métier ici — branche hooks + composants
// ============================================================

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Typography, Divider } from "antd";

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
import DrawerApercu from "../ui/Zone3/DrawerApercu";

const { Title } = Typography;

const SuiviDashboard = () => {
  const { numero } = useParams();

  // ── State drawer ─────────────────────────────────────────
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  // ── Hooks ────────────────────────────────────────────────
  const { kpis,       loading: l1 } = useSuiviKpis(numero);
  const { graphiques, loading: l2 } = useSuiviGraphiques(numero);
  const { tableau,    loading: l3 } = useSuiviTableau(numero);

  // ── Handlers ─────────────────────────────────────────────
  const handleApercu = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  return (
    <div style={{ padding: "24px" }}>

      {/* ── Zone 1 — Alertes + KPIs ── */}
      <AlertesBanner alertes={kpis?.alertes} />
      <KpiCards kpis={kpis} loading={l1} />

      <Divider style={{ margin: "8px 0 20px" }} />

      {/* ── Zone 2 — Graphiques ── */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Évolution biologique
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} >
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

      {/* ── Zone 3 — Tableau + Drawer ── */}
      <Title level={5} style={{ marginBottom: 16 }}>
        Historique des bilans
      </Title>

      <TableauSuivi
        data={tableau}
        loading={l3}
        onApercu={handleApercu}
      />

      <DrawerApercu
        row={selectedRow}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />

    </div>
  );
};

export default SuiviDashboard;
