import { Card, Empty, Segmented, Drawer, Table, Tag } from "antd";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { GENDER_COLORS } from "../constants/chartColors";
import usePassageStades, { SEGMENTS, ROLLUP_COLORS } from "../hooks/usePassageStades";

// ── Tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f0f0f0",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}>
      <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "2px 0", color: p.color }}>
          {p.name} : <strong>{p.value}</strong>
        </p>
      ))}
      <p style={{ margin: "6px 0 0", borderTop: "1px solid #f5f5f5", paddingTop: 4, color: "#8c8c8c", fontSize: 11 }}>
        Cliquer pour voir le détail
      </p>
    </div>
  );
};

// ── Colonnes Drawer rollup ────────────────────────────────────
const rollupDrawerColumns = [
  { title: "Indicateur", dataIndex: "label",  key: "label"  },
  { title: "Total",      dataIndex: "valeur", key: "valeur" },
];

// ── Colonnes Drawer drilldown ─────────────────────────────────
const drilldownDrawerColumns = [
  {
    title: "Genre", dataIndex: "genre", key: "genre",
    render: (v) => (
      <Tag color={v === "Hommes" ? "blue" : v === "Femmes" ? "magenta" : "purple"}>
        {v}
      </Tag>
    ),
  },
  { title: "Nombre", dataIndex: "valeur", key: "valeur" },
];

// ── Composant ─────────────────────────────────────────────────
const PassageStadesChart = ({
  decesSida, decesNormaux, perdusDeVue, transferts, migrants, loading,
}) => {
  const {
    activeSegment,
    setActiveSegment,
    activeData,
    isRollup,
    drawer,
    handlePointClick,
    closeDrawer,
  } = usePassageStades({ decesSida, decesNormaux, perdusDeVue, transferts, migrants });

  // ── Drawer rollup — toutes les séries de la tranche ──────────
  const rollupDrawerData = drawer.row
    ? [
        { key: "decesSida",    label: "Décès SIDA",    valeur: drawer.row.decesSida    ?? 0 },
        { key: "decesNormaux", label: "Décès normaux",  valeur: drawer.row.decesNormaux ?? 0 },
        { key: "perdusDeVue",  label: "Perdus de vue",  valeur: drawer.row.perdusDeVue  ?? 0 },
        { key: "transferts",   label: "Transferts",     valeur: drawer.row.transferts   ?? 0 },
        { key: "migrants",     label: "Migrants",       valeur: drawer.row.migrants     ?? 0 },
      ]
    : [];

  // ── Drawer drilldown — genre de la tranche ───────────────────
  const drilldownDrawerData = drawer.row
    ? [
        { key: "homme",      genre: "Hommes",      valeur: drawer.row.homme      ?? 0 },
        { key: "femme",      genre: "Femmes",      valeur: drawer.row.femme      ?? 0 },
        { key: "transgenre", genre: "Transgenres", valeur: drawer.row.transgenre ?? 0 },
      ]
    : [];

  const drawerTitle = isRollup
    ? `Tous les indicateurs — Tranche : ${drawer.tranche}`
    : `${SEGMENTS.find((s) => s.key === activeSegment)?.label} — Tranche : ${drawer.tranche}`;

  return (
    <>
      <Card
        title="Passage des stades"
        size="small"
        loading={loading}
        extra={
          <Segmented
            size="small"
            options={SEGMENTS.map((s) => ({ label: s.label, value: s.key }))}
            value={activeSegment}
            onChange={setActiveSegment}
          />
        }
      >
        {!activeData?.length
          ? <Empty description="Aucune donnée" />
          : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={activeData}
                margin={{ top: 8, right: 16, bottom: 24, left: 16 }}
                onClick={handlePointClick}
                style={{ cursor: "pointer" }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="tranche" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "Nombre des patients", angle: -90, position: "insideLeft", offset: 20, fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />

                {/* ── ROLLUP — une ligne par indicateur ── */}
                {isRollup && Object.entries(ROLLUP_COLORS).map(([key, color]) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={SEGMENTS.find((s) => s.key === key)?.label}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 4, fill: color, stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                ))}

                {/* ── DRILLDOWN — une ligne par genre ── */}
                {!isRollup && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="homme"
                      name="Hommes"
                      stroke={GENDER_COLORS.homme}
                      strokeWidth={2}
                      dot={{ r: 4, fill: GENDER_COLORS.homme, stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="femme"
                      name="Femmes"
                      stroke={GENDER_COLORS.femme}
                      strokeWidth={2}
                      dot={{ r: 4, fill: GENDER_COLORS.femme, stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="transgenre"
                      name="Transgenres"
                      stroke={GENDER_COLORS.transgenre}
                      strokeWidth={2}
                      dot={{ r: 4, fill: GENDER_COLORS.transgenre, stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          )
        }
      </Card>

      {/* ── Drawer ── */}
      <Drawer
        title={drawerTitle}
        placement="right"
        size="default"
        open={drawer.open}
        onClose={closeDrawer}
      >
        {isRollup
          ? (
            <Table
              size="small"
              dataSource={rollupDrawerData}
              columns={rollupDrawerColumns}
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell><strong>Total</strong></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <strong>
                      {rollupDrawerData.reduce((s, r) => s + r.valeur, 0)}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          )
          : (
            <Table
              size="small"
              dataSource={drilldownDrawerData}
              columns={drilldownDrawerColumns}
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell><strong>Total</strong></Table.Summary.Cell>
                  <Table.Summary.Cell>
                    <strong>{drawer.row?.total ?? 0}</strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          )
        }
      </Drawer>
    </>
  );
};

export default PassageStadesChart;