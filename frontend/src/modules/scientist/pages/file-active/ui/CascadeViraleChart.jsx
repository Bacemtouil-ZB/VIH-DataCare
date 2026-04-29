import { Card, Empty } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { COUCHES_CASCADE } from "../constants/cascadeVirale";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f0f0f0",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 12,
    }}>
      <p style={{ margin: "0 0 4px", fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "2px 0", color: p.fill }}>
          {p.name} : {p.value} ({total ? ((p.value / total) * 100).toFixed(0) : 0}%)
        </p>
      ))}
      <p style={{ margin: "4px 0 0", fontWeight: 600 }}>Total : {total}</p>
    </div>
  );
};

const CascadeViraleChart = ({ data, loading }) => (
  <Card
    title="Cascade virologique ONUSIDA (CV)"
    size="small"
    loading={loading}
  >
    {!data?.length
      ? <Empty description="Aucune donnée" />
      : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 24, left: 16 }}>
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {COUCHES_CASCADE.map(({ key, label, color }) => (
              <Bar
                key={key}
                dataKey={key}
                name={label}
                stackId="cv"
                fill={color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )
    }
  </Card>
);

export default CascadeViraleChart;