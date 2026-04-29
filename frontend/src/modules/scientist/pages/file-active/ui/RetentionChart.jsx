import { Card, Empty } from "antd";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { RETENTION_COLORS } from "../constants/chartColors";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const perdu    = payload.find(p => p.dataKey === "perdu_de_vue");
  const recupere = payload.find(p => p.dataKey === "recupere");
  const total    = (perdu?.value ?? 0) + (recupere?.value ?? 0);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f0f0f0",
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}>
      <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#262626" }}>
        Tranche : {label}
      </p>
      {perdu && (
        <p style={{ margin: "2px 0", color: perdu.color }}>
          Perdus de vue : <strong>{perdu.value}</strong>
        </p>
      )}
      {recupere && (
        <p style={{ margin: "2px 0", color: recupere.color }}>
          Récupérés : <strong>{recupere.value}</strong>
        </p>
      )}
      <p style={{ margin: "6px 0 0", borderTop: "1px solid #f0f0f0", paddingTop: 4, color: "#595959" }}>
        Total : <strong>{total}</strong>
      </p>
    </div>
  );
};

const RetentionChart = ({ data, loading }) => (
  <Card
    title="Perdus de vue vs Récupérés"
    size="small"
    loading={loading}
  >
    {!data?.length
      ? <Empty description="Aucune donnée" />
      : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 12, right: 16, bottom: 8, left: 16 }}
          >
            <defs>
              <linearGradient id="gradPerdu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={RETENTION_COLORS.perdu_de_vue} stopOpacity={0.25} />
                <stop offset="95%" stopColor={RETENTION_COLORS.perdu_de_vue} stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="gradRecupere" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={RETENTION_COLORS.recupere} stopOpacity={0.25} />
                <stop offset="95%" stopColor={RETENTION_COLORS.recupere} stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />

            <XAxis
              dataKey="tranche"
              tick={{ fontSize: 11, fill: "#8c8c8c" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#8c8c8c" }}
              axisLine={false}
              tickLine={false}
              label={{
                value: "Nombre des patients",
                angle: -90,
                position: "insideLeft",
                offset: 20,
                fontSize: 10,
                fill: "#bfbfbf",
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />

            {/* Perdus de vue — en dessous */}
            <Area
              type="monotone"
              dataKey="perdu_de_vue"
              name="Perdus de vue"
              stackId="1"
              stroke={RETENTION_COLORS.perdu_de_vue}
              strokeWidth={2}
              fill="url(#gradPerdu)"
              dot={{ r: 3, fill: RETENTION_COLORS.perdu_de_vue, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />

            {/* Récupérés — empilé au-dessus */}
            <Area
              type="monotone"
              dataKey="recupere"
              name="Récupérés"
              stackId="1"
              stroke={RETENTION_COLORS.recupere}
              strokeWidth={2}
              fill="url(#gradRecupere)"
              dot={{ r: 3, fill: RETENTION_COLORS.recupere, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    }
  </Card>
);

export default RetentionChart;