import { useParams } from "react-router-dom";
import { Row, Col, Typography, Divider, Spin, Alert } from "antd";
import useSuiviKpis from "../usesuivi/useSuiviKpis";
import useSuiviGraphiques from "../usesuivi/useSuiviGraphiques";
import useSuiviTableau from "../usesuivi/useSuiviTableau";
import AlertesBanner from "../ui/Zone1/AlertesBanner";
import KpiCards from "../ui/Zone1/KpiCards";
import GraphiqueCD4 from "../ui/Zone2/GraphiqueCD4";
import GraphiqueCV from "../ui/Zone2/GraphiqueCV";
import TableauSuivi from "../ui/Zone3/TableauSuivi";
import { getSuiviDashboardState } from "./suiviDashboardHelpers";

const { Title } = Typography;

const SuiviDashboard = () => {
  const { numero } = useParams();

  const kpisState = useSuiviKpis(numero);
  const graphiquesState = useSuiviGraphiques(numero);
  const tableauState = useSuiviTableau(numero);
  const dashboardState = getSuiviDashboardState(kpisState, graphiquesState, tableauState);

  return (
    <div className="suivi-dashboard">
      {dashboardState.loading && (
        <Spin size="large" className="suivi-dashboard-loading" />
      )}

      {dashboardState.error && (
        <Alert
          type="error"
          message="Erreur"
          description={dashboardState.error}
          showIcon
          className="suivi-dashboard-error"
        />
      )}

      <AlertesBanner alertes={kpisState.kpis?.alertes} />
      <KpiCards kpis={kpisState.kpis} loading={kpisState.loading} />

      <Divider className="suivi-dashboard-divider" />

      <Title level={5} className="suivi-dashboard-section-title">
        Évolution biologique
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <GraphiqueCD4
            data={graphiquesState.graphiques.cd4}
            periodes={graphiquesState.graphiques.periodes}
            loading={graphiquesState.loading}
          />
        </Col>
        <Col xs={24}>
          <GraphiqueCV
            data={graphiquesState.graphiques.cv}
            periodes={graphiquesState.graphiques.periodes}
            loading={graphiquesState.loading}
          />
        </Col>
      </Row>

      <Divider className="suivi-dashboard-divider" />

      <Title level={5} className="suivi-dashboard-section-title">
        Historique des bilans
      </Title>

      <TableauSuivi
        data={tableauState.tableau}
        loading={tableauState.loading}
      />
    </div>
  );
};

export default SuiviDashboard;
