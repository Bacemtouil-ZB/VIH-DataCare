import { Row, Col, Spin, Alert } from "antd";
import useNouveauxMaladesDashboard from "../hooks/useNouveauxMaladesDashboard";

import FilterBar          from "../ui/FilterBar";
import KpiSummaryCards    from "../ui/KpiSummaryCards";
import CasSexeAgeChart    from "../ui/CasSexeAgeChart";
import DiagnosticTardifChart from "../ui/DiagnosticTardifChart";
import PopulationsClesChart  from "../ui/PopulationsClesChart";

import styles from "../css/nouveauxMalades.module.css";

const NouveauxMaladesOrchestrer = () => {
  const {
    annees,
    annee,
    setAnnee,
    trimestre,
    setTrimestre,
    chartData,
    loading,
    error,
    refreshing,
    lastRefreshedAt,
    handleRefresh,
  } = useNouveauxMaladesDashboard();

  if (loading && !chartData) {
    return (
      <div className={styles.center}>
        <Spin size="large" />
      </div>
    );
  }

  if (error && !chartData) {
    return (
      <div className={styles.page}>
        <Alert
          type="error"
          message="Erreur chargement dashboard"
          description={error}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── Filtres ── */}
      <FilterBar
        annees={annees}
        annee={annee}
        onAnneeChange={setAnnee}
        trimestre={trimestre}
        onTrimestreChange={setTrimestre}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        lastRefreshedAt={lastRefreshedAt}
      />

      {/* ── KPI ── */}
      <div style={{ margin: "20px 0" }}>
        <KpiSummaryCards
          data={chartData?.kpis || {}}
          loading={loading}
          error={error}
        />
      </div>

      
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          
          <CasSexeAgeChart
            data={chartData?.casSexeAge || []}
            loading={loading}
          />
        </Col>

        <Col xs={24} lg={12}>
          <DiagnosticTardifChart
            data={chartData?.diagnosticTardif || []}
            loading={loading}
          />
        </Col>
      </Row>

    
      <div style={{ marginTop: 16 }}>
        <PopulationsClesChart
          data={chartData?.populationsCles || {}}
          loading={loading}
        />
      </div>

    </div>
  );
};

export default NouveauxMaladesOrchestrer;