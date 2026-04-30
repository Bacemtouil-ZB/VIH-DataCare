import { Row, Col, Spin, Alert, Typography, Space } from "antd";
import useFileActiveDashboard  from "./hooks/useFileActiveDashboard";

import KpiFileActiveCards      from "./ui/KpiFileActiveCards";
import TotalFileActiveChart    from "./ui/TotalFileActiveChart";
import CvControleChart         from "./ui/CvControleChart";
import CascadeViraleChart      from "./ui/CascadeViraleChart";
import PassageStadesChart      from "./ui/PassageStadesChart";
import RecuperationChart       from "./ui/RecuperationChart";

import RefreshButton from "../../components/RefreshButton";
import styles from "./css/fileActive.module.css";

const FileActiveOrchestrer = () => {
  const {
    annee,
    chartData,
    loading,
    error,
    refreshing,
    lastRefreshedAt,
    handleRefresh,
  } = useFileActiveDashboard();

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
        <Alert type="error" showIcon description={error} />
      </div>
    );
  }

  return (
    <div className={styles.page}>

      {/* ── En-tête + Refresh ── */}
      <Space style={{ width: "100%", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={5} style={{ margin: 0, color: "#595959" }}>
          File active — {annee}
        </Typography.Title>
        <RefreshButton
          refreshing={refreshing}
          onRefresh={handleRefresh}
          lastRefreshedAt={lastRefreshedAt}
        />
      </Space>

      {/* ── KPI cards ── */}
      <div style={{ marginBottom: 20 }}>
        <KpiFileActiveCards
          data={chartData?.kpis}
          loading={loading}
          error={error}
        />
      </div>

      {/* ── Ligne 1 : Total file active + CV contrôle ── */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <TotalFileActiveChart
            data={chartData?.totalFileActive}
            loading={loading}
          />
        </Col>
        <Col xs={24} lg={12}>
          <CvControleChart
            data={chartData?.cvControle}
            cible95={chartData?.cvCible95}
            loading={loading}
          />
        </Col>
      </Row>

      {/* ── Ligne 2 : Cascade virologique ── */}
      <div style={{ marginBottom: 16 }}>
        <CascadeViraleChart
          data={chartData?.cascadeVirale}
          loading={loading}
        />
      </div>

      {/* ── Ligne 3 : Passage des stades (tranche_3) ── */}
      <div style={{ marginBottom: 16 }}>
        <PassageStadesChart
          decesSida={chartData?.decesSida}
          decesNormaux={chartData?.decesNormaux}
          perdusDeVue={chartData?.perdusDeVue}
          transferts={chartData?.transferts}
          migrants={chartData?.migrants}
          loading={loading}
        />
      </div>

      {/* ── Ligne 4 : Récupération des perdus de vue (tranche_8) ── */}
      <RecuperationChart
        data={chartData?.recuperes}
        loading={loading}
      />

    </div>
  );
};

export default FileActiveOrchestrer;