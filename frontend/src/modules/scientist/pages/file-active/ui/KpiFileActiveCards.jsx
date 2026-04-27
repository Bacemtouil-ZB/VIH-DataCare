import { Row, Col, Card, Statistic, Alert } from "antd";
import { UserOutlined, ManOutlined, WomanOutlined } from "@ant-design/icons";

const TransgenreIcon = () => (
  <span style={{ fontSize: 28, lineHeight: 1, color: "inherit", fontFamily: "serif" }}>
    ⚧
  </span>
);

const KpiFileActiveCards = ({ data, loading, error }) => {
  if (error) return <Alert type="error" showIcon title={error} />;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} size="small">
          <Statistic
            title="Total file active"
            value={data?.total ?? 0}
            prefix={<UserOutlined />}
            styles={{ content: { color: "#1890ff" } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} size="small">
          <Statistic
            title="Hommes"
            value={data?.homme ?? 0}
            prefix={<ManOutlined />}
            styles={{ content: { color: "#1890ff" } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} size="small">
          <Statistic
            title="Femmes"
            value={data?.femme ?? 0}
            prefix={<WomanOutlined />}
            styles={{ content: { color: "#eb2f96" } }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} size="small">
          <Statistic
            title="Transgenres"
            value={data?.transgenre ?? 0}
            prefix={<TransgenreIcon />}
            styles={{ content: { color: "#722ed1" } }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default KpiFileActiveCards;