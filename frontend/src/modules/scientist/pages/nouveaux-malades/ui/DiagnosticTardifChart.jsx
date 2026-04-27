import { Card, Empty }                        from "antd";
import { BarChart, Bar, XAxis, YAxis,
         Tooltip, Legend, CartesianGrid,
         ResponsiveContainer }                from "recharts";

// Nouvelles clés CD4 issues du backend : lt200 / entre_200_350 / gt350
const CD4_BARS = [
  { key: "lt200",         label: "CD4 < 200",     color: "#ff4d4f" },
  { key: "entre_200_350", label: "CD4 200–350",   color: "#fa8c16" },
  { key: "gt350",         label: "CD4 > 350",     color: "#52c41a" },
];

const DiagnosticTardifChart = ({ data, loading }) => (
  <Card
    title="Classification des patients selon le niveau initial de CD4"
    size="small"
    loading={loading}
  >
    {!data?.length
      ? <Empty description="Aucune donnée" />
      : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 8, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="tranche" tick={{ fontSize: 11 }} />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              label={{
                value: "Nombre des patients",
                angle: -90,
                position: "insideLeft",
                offset: 20,
                fontSize: 11,
              }}
            />
            <Tooltip />
            <Legend />
            {CD4_BARS.map(({ key, label, color }) => (
              <Bar
                key={key}
                dataKey={key}
                name={label}
                stackId="cd4"
                fill={color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )
    }
  </Card>
);

export default DiagnosticTardifChart;