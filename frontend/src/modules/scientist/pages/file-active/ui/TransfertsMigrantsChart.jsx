import { Card, Empty, Row, Col } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer,
} from "recharts";
import { DIVERS_COLORS } from "../constants/chartColors";

const MiniBar = ({ data, dataKey, color, label }) => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={data} margin={{ top: 4, right: 8, bottom: 8, left: 16 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="tranche" tick={{ fontSize: 10 }} />
      <YAxis
        allowDecimals={false}
        tick={{ fontSize: 10 }}
        label={{
          value: "Nombre des patients",
          angle: -90,
          position: "insideLeft",
          offset: 20,
          fontSize: 10,
        }}
      />
      <Tooltip />
      <Bar dataKey={dataKey} name={label} fill={color} radius={[3,3,0,0]} />
    </BarChart>
  </ResponsiveContainer>
);

const TransfertsMigrantsChart = ({ transferts, migrants, loading }) => {
  const noData = !transferts?.length && !migrants?.length;

  return (
    <Card title="Transferts & Migrants" size="small" loading={loading}>
      {noData
        ? <Empty description="Aucune donnée" />
        : (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13, color: "#595959" }}>
                Transferts
              </p>
              {transferts?.length
                ? <MiniBar data={transferts} dataKey="total" color={DIVERS_COLORS.transferts} label="Transferts" />
                : <Empty description="Aucune donnée" />
              }
            </Col>
            <Col xs={24} md={12}>
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13, color: "#595959" }}>
                Migrants
              </p>
              {migrants?.length
                ? <MiniBar data={migrants} dataKey="total" color={DIVERS_COLORS.migrants} label="Migrants" />
                : <Empty description="Aucune donnée" />
              }
            </Col>
          </Row>
        )
      }
    </Card>
  );
};

export default TransfertsMigrantsChart;