// import { Card, Empty, Drawer, Table, Tag } from "antd";
// import { useState } from "react";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip,
//   Legend, CartesianGrid, ResponsiveContainer,
// } from "recharts";
// import { GENDER_COLORS } from "../constants/chartColors";

// // ── Tooltip ───────────────────────────────────────────────────
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{
//       background: "#fff",
//       border: "1px solid #f0f0f0",
//       borderRadius: 6,
//       padding: "8px 12px",
//       fontSize: 12,
//       boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//     }}>
//       <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{label}</p>
//       {payload.map((p) => (
//         <p key={p.dataKey} style={{ margin: "2px 0", color: p.color }}>
//           {p.name} : <strong>{p.value}</strong>
//         </p>
//       ))}
//       <p style={{ margin: "6px 0 0", borderTop: "1px solid #f5f5f5", paddingTop: 4, color: "#8c8c8c", fontSize: 11 }}>
//         Cliquer pour voir le détail
//       </p>
//     </div>
//   );
// };

// // ── Colonnes Drawer ───────────────────────────────────────────
// const drawerColumns = [
//   {
//     title: "Genre", dataIndex: "genre", key: "genre",
//     render: (v) => (
//       <Tag color={v === "Hommes" ? "blue" : v === "Femmes" ? "magenta" : "purple"}>
//         {v}
//       </Tag>
//     ),
//   },
//   { title: "Nombre", dataIndex: "valeur", key: "valeur" },
// ];

// // ── Composant ─────────────────────────────────────────────────
// const RecuperationChart = ({ data, loading }) => {

//   const [drawer, setDrawer] = useState({ open: false, tranche: null, row: null });

//   const handlePointClick = (chartPayload) => {
//     if (!chartPayload?.activePayload?.length) return;
//     const tranche = chartPayload.activeLabel;
//     const row     = (data ?? []).find((r) => r.tranche === tranche);
//     if (!row) return;
//     setDrawer({ open: true, tranche, row });
//   };

//   const closeDrawer = () => setDrawer({ open: false, tranche: null, row: null });

//   const drawerTableData = drawer.row
//     ? [
//         { key: "homme",      genre: "Hommes",      valeur: drawer.row.homme      ?? 0 },
//         { key: "femme",      genre: "Femmes",      valeur: drawer.row.femme      ?? 0 },
//         { key: "transgenre", genre: "Transgenres", valeur: drawer.row.transgenre ?? 0 },
//       ]
//     : [];

//   return (
//     <>
//       <Card
//         title="Récupération des perdus de vue"
//         size="small"
//         loading={loading}
//       >
//         {!data?.length
//           ? <Empty description="Aucune donnée" />
//           : (
//             <ResponsiveContainer width="100%" height={280}>
//               <LineChart
//                 data={data}
//                 margin={{ top: 8, right: 16, bottom: 24, left: 16 }}
//                 onClick={handlePointClick}
//                 style={{ cursor: "pointer" }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
//                 <XAxis
//                   dataKey="tranche"
//                   tick={{ fontSize: 11 }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <YAxis
//                   allowDecimals={false}
//                   tick={{ fontSize: 11 }}
//                   axisLine={false}
//                   tickLine={false}
//                   label={{
//                     value: "Nombre des patients",
//                     angle: -90,
//                     position: "insideLeft",
//                     offset: 20,
//                     fontSize: 11,
//                   }}
//                 />
//                 <Tooltip content={<CustomTooltip />} />
//                 <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
//                 <Line
//                   type="monotone"
//                   dataKey="homme"
//                   name="Hommes"
//                   stroke={GENDER_COLORS.homme}
//                   strokeWidth={2}
//                   dot={{ r: 4, fill: GENDER_COLORS.homme, stroke: "#fff", strokeWidth: 2 }}
//                   activeDot={{ r: 6 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="femme"
//                   name="Femmes"
//                   stroke={GENDER_COLORS.femme}
//                   strokeWidth={2}
//                   dot={{ r: 4, fill: GENDER_COLORS.femme, stroke: "#fff", strokeWidth: 2 }}
//                   activeDot={{ r: 6 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="transgenre"
//                   name="Transgenres"
//                   stroke={GENDER_COLORS.transgenre}
//                   strokeWidth={2}
//                   dot={{ r: 4, fill: GENDER_COLORS.transgenre, stroke: "#fff", strokeWidth: 2 }}
//                   activeDot={{ r: 6 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           )
//         }
//       </Card>

//       {/* ── Drawer drilldown ── */}
//       <Drawer
//         title={
//           <span>
//             Récupération — Tranche : <strong>{drawer.tranche}</strong>
//           </span>
//         }
//         placement="right"
//         size="default"
//         open={drawer.open}
//         onClose={closeDrawer}
//       >
//         <Table
//           size="small"
//           dataSource={drawerTableData}
//           columns={drawerColumns}
//           pagination={false}
//           summary={() => (
//             <Table.Summary.Row>
//               <Table.Summary.Cell><strong>Total</strong></Table.Summary.Cell>
//               <Table.Summary.Cell>
//                 <strong>{drawer.row?.total ?? 0}</strong>
//               </Table.Summary.Cell>
//             </Table.Summary.Row>
//           )}
//         />
//       </Drawer>
//     </>
//   );
// };

// export default RecuperationChart;

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