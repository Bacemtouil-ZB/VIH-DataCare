import { Card, Empty, Tag }                   from "antd";
import { BarChart, Bar, XAxis, YAxis,
         Tooltip, Legend, CartesianGrid,
         ResponsiveContainer, Cell }          from "recharts";

// ✅ Clés alignées exactement avec le CASE SQL dans mv_diagnostic_tardif
const CD4_BARS = [
  { key: "lt200",       label: "CD4 < 200",       color: "#ff4d4f" },
  { key: "200_350",     label: "CD4 200–350",      color: "#fa8c16" }, // ← était "entre_200_350"
  { key: "gt350",       label: "CD4 > 350",        color: "#52c41a" },

];

// Tooltip personnalisé pour afficher le total de la barre
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0); // total inchangé car sans_mesure absent
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f0f0f0",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,.1)",
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill, marginBottom: 2 }}>
          {p.name} : <strong>{p.value}</strong>
        </div>
      ))}
      <div style={{
        borderTop: "1px solid #f0f0f0",
        marginTop: 4,
        paddingTop: 4,
        fontWeight: 600,
      }}>
        Total : {total}
      </div>
    </div>
  );
};

const DiagnosticTardifChart = ({ data, loading }) => (
  <Card
    title="Diagnostic tardif : nombre de nouveaux patients selon la mesure CD4"
    size="small"
    loading={loading}
  >
    {!data?.length ? (
      <Empty description="Aucune donnée" />
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="tranche" tick={{ fontSize: 11 }} />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11 }}
            label={{
              value: "Nombre de patients",
              angle: -90,
              position: "insideLeft",
              offset: 20,
              fontSize: 11,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span style={{ fontSize: 11 }}>{value}</span>
            )}
          />
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
    )}
  </Card>
);

export default DiagnosticTardifChart;