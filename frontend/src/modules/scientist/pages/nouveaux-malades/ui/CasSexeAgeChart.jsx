import { Card, Empty }                        from "antd";
import { BarChart, Bar, XAxis, YAxis,
         Tooltip, Legend, CartesianGrid,
         ResponsiveContainer }                from "recharts";
import { GENDER_COLORS }                      from "../constants/chartColors";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);

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
      {payload.map((p) => (
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

const CasSexeAgeChart = ({ data, loading }) => (
  <Card
    title="Nombre de PVVIH ayant nouvellement dépistés"
    size="small"
    loading={loading}
  >
    {!data?.length
      ? <Empty description="Aucune donnée" />
      : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="tranche"
              tick={{ fontSize: 11 }}
          
            />

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
            <Legend
              formatter={(value) => (
                <span style={{ fontSize: 11 }}>{value}</span>
              )}
            />

            <Bar
              dataKey="homme"
              name="Hommes"
              fill={GENDER_COLORS.homme}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="femme"
              name="Femmes"
              fill={GENDER_COLORS.femme}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="transgenre"
              name="Transgenres"
              fill={GENDER_COLORS.transgenre}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  </Card>
);

export default CasSexeAgeChart;