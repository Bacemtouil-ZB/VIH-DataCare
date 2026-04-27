import { Card, Empty, Row, Col, Tabs } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

// ── Couleurs par groupe ──────────────────────────────────────
const GENDER_COLORS = {
  homme:      "#1890ff",
  femme:      "#eb2f96",
  transgenre: "#722ed1",
};

// ── Mini bar groupé pour drill-down ──────────────────────────
const DetailBar = ({ data = [] }) => (
  <div style={{ width: "82%", margin: "0 auto" }}>
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="tranche" tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Bar dataKey="homme"      name="Hommes"      fill={GENDER_COLORS.homme}      radius={[2,2,0,0]} />
        <Bar dataKey="femme"      name="Femmes"      fill={GENDER_COLORS.femme}      radius={[2,2,0,0]} />
        <Bar dataKey="transgenre" name="Transgenres" fill={GENDER_COLORS.transgenre} radius={[2,2,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ── Composant principal ───────────────────────────────────────
const PopulationsClesChart = ({ data, loading }) => {
  if (!data) return <Card loading={loading} size="small" />;
  if (!data.pieData?.length) return <Empty description="Aucune donnée" />;

  const { pieData, detail = {} } = data;

  // Onglets drill-down : un par groupe (hsh / udi / ps / transgenres)
  const tabItems = [
    { key: "hsh",         label: "HSH",         data: detail.hsh         },
    { key: "udi",         label: "UDI",         data: detail.udi         },
    { key: "ps",          label: "PS",          data: detail.ps          },
    { key: "transgenres", label: "Transgenres", data: detail.transgenres },
  ]
    .filter((t) => t.data?.length)
    .map((t) => ({
      key:      t.key,
      label:    t.label,
      children: (
        <DetailBar data={t.data} />
      ),
    }));

  return (
    <Card
      title="Ventilation selon le profil des patients"
      size="small"
      loading={loading}
    >
      <Row gutter={[16, 16]} align="middle">

        {/* Donut global */}
        <Col xs={24} md={8}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Col>

        {/* Drill-down par groupe */}
        <Col xs={24} md={16}>
          <Tabs size="small" items={tabItems} />
        </Col>

      </Row>
    </Card>
  );
};

export default PopulationsClesChart;