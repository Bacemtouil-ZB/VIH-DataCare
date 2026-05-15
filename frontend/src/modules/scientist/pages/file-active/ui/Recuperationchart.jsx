import { Card, Empty } from "antd";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { Segmented } from "antd";
import { GENDER_COLORS } from "../constants/chartColors";

// ── Filtres ───────────────────────────────────────────────────
const FILTERS = [
  { key: "tous",       label: "Tous"        },
  { key: "homme",      label: "Hommes"      },
  { key: "femme",      label: "Femmes"      },
  { key: "transgenre", label: "Transgenres" },
];

const KEY_LABELS = { homme: "Hommes", femme: "Femmes", transgenre: "Transgenres" };

// ── Tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f0f0f0",
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}>
      <p style={{ margin: "0 0 6px", fontWeight: 700 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "2px 0", color: p.fill }}>
          {p.name} : <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Composant ─────────────────────────────────────────────────
const RecuperationChart = ({ data, loading }) => {
  const [activeFilter, setActiveFilter] = useState("tous");

  const visibleKeys = activeFilter === "tous"
    ? ["homme", "femme", "transgenre"]
    : [activeFilter];

  return (
    <Card
      title="Récupération des perdus de vue"
      size="small"
      loading={loading}
      extra={
        <Segmented
          size="small"
          options={FILTERS.map((f) => ({ label: f.label, value: f.key }))}
          value={activeFilter}
          onChange={setActiveFilter}
        />
      }
    >
      {!data?.length
        ? <Empty description="Aucune donnée" />
        : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 16, bottom: 24, left: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis
                dataKey="tranche"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Nombre des patients",
                  angle: -90,
                  position: "insideLeft",
                  offset: 20,
                  fontSize: 11,
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />

              {visibleKeys.map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={KEY_LABELS[key]}
                  fill={GENDER_COLORS[key]}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
      }
    </Card>
  );
};

export default RecuperationChart;