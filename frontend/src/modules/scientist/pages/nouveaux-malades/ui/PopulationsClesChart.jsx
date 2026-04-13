import { Card, Empty, Row, Col, Table } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLUMNS = [
  { title: "Groupe",   dataIndex: "groupe", key: "groupe" },
  { title: "< 25 ans", dataIndex: "lt25",   key: "lt25"   },
  { title: "≥ 25 ans", dataIndex: "gte25",  key: "gte25"  },
  { title: "Total",    dataIndex: "total",  key: "total",
    render: (v) => <strong>{v}</strong> },
];

const PopulationsClesChart = ({ data, loading }) => {
  if (!data) return <Card loading={loading} size="small" />;
  if (!data.pieData?.length) return <Empty description="Aucune donnée" />;

  const tableData = [
    { key: "hsh",         groupe: "HSH",        ...data.hsh         },
    { key: "udi",         groupe: "UDI",         ...data.udi         },
    { key: "transgenres", groupe: "Transgenres", ...data.transgenres },
  ];

  return (
    <Card title="Ventilation selon le profil des patients" size="small" loading={loading}>
      <Row gutter={[16, 16]} align="middle">

        <Col xs={24} md={10}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              {/* ✅ Legend supprimé — remplacé par le tableau à droite */}
            </PieChart>
          </ResponsiveContainer>
        </Col>

        <Col xs={24} md={14}>
          <Table
            columns={COLUMNS}
            dataSource={tableData}
            pagination={false}
            size="small"
            bordered
          />
        </Col>

      </Row>
    </Card>
  );
};

export default PopulationsClesChart;