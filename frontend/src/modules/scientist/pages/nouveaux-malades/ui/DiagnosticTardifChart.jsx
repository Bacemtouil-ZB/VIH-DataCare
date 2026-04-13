import { Card, Empty }                        from "antd";
import { BarChart, Bar, XAxis, YAxis,
         Tooltip, Legend, CartesianGrid,
         ResponsiveContainer }                from "recharts";
import { CD4_COLORS }                         from "../constants/chartColors";
import { SEUILS_CD4, SEUILS_CD4_LABELS }      from "../constants/seuilsCd4";

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
            {SEUILS_CD4.map((seuil) => (
              <Bar
                key={seuil}
                dataKey={seuil}
                name={SEUILS_CD4_LABELS[seuil]}
                stackId="cd4"
                fill={CD4_COLORS[seuil]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )
    }
  </Card>
);

export default DiagnosticTardifChart;