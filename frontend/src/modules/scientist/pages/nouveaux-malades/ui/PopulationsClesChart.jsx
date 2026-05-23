import { Card, Empty, Row, Col, Tabs } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";


const GENDER_COLORS = {
  homme:      "#1890ff",
  femme:      "#eb2f96",
  transgenre: "#722ed1",
};

const GROUP_COLORS = {
  hsh:         "#1890ff",
  udi:         "#52c41a",
  ps:          "#faad14",
  transgenres: "#722ed1",
};

/**
 * Agrège les données de tous les groupes par tranche d'âge.
 * Retourne un tableau { tranche, hsh, udi, ps, transgenres }.
 */
const aggregateByGroup = (detail = {}) => {
  const map = {};
  Object.entries(detail).forEach(([group, rows]) => {
    if (!Array.isArray(rows)) return;
    rows.forEach((row) => {
      const t = row.tranche;
      if (!t) return;
      if (!map[t]) map[t] = { tranche: t, hsh: 0, udi: 0, ps: 0, transgenres: 0 };
      map[t][group] = (map[t][group] || 0)
        + (Number(row.homme)      || 0)
        + (Number(row.femme)      || 0)
        + (Number(row.transgenre) || 0);
    });
  });
  return Object.values(map);
};

// ─────────────────────────────────────────────────────────────
// Sous-composants
// ─────────────────────────────────────────────────────────────

/**
 * Bar chart agrégé — onglet "Tous".
 * Affiche une barre par groupe (HSH, UDI, PS, Transgenres) par tranche.
 */
const AggregatedBar = ({ data = [] }) => (
  <div style={{ width: "82%", margin: "0 auto" }}>
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="tranche" tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
        <Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: "none" }} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Bar dataKey="hsh"         name="HSH"         fill={GROUP_COLORS.hsh}         radius={[2, 2, 0, 0]} />
        <Bar dataKey="udi"         name="UDI"         fill={GROUP_COLORS.udi}         radius={[2, 2, 0, 0]} />
        <Bar dataKey="ps"          name="PS"          fill={GROUP_COLORS.ps}          radius={[2, 2, 0, 0]} />
        <Bar dataKey="transgenres" name="Transgenres" fill={GROUP_COLORS.transgenres} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Tooltip personnalisé pour HSH et Transgenres.
 * Affiche uniquement la tranche et le total (sans détail par sexe).
 */
const TooltipTotal = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, e) => sum + (e.value || 0), 0);
  return (
    <div style={{ background: "#fff", border: "1px solid #d9d9d9", borderRadius: 6, padding: "6px 10px", fontSize: 12 }}>
      <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0 }}>Total : {total}</p>
    </div>
  );
};

/**
 * Bar chart détaillé par sexe — onglets HSH / UDI / PS / Transgenres.
 * hideSex=true → tooltip affiche seulement le total (HSH, Transgenres).
 * hideSex=false → tooltip standard avec détail par sexe (UDI, PS).
 */
const DetailBar = ({ data = [], hideSex = false }) => (
  <div style={{ width: "82%", margin: "0 auto" }}>
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="tranche" tick={{ fontSize: 10 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
        <Tooltip content={hideSex ? <TooltipTotal /> : undefined} wrapperStyle={{ zIndex: 100, pointerEvents: "none" }} />
        <Legend wrapperStyle={{ fontSize: 10 }} />
        <Bar dataKey="homme"      name="Hommes"      fill={GENDER_COLORS.homme}      radius={[2, 2, 0, 0]} />
        <Bar dataKey="femme"      name="Femmes"      fill={GENDER_COLORS.femme}      radius={[2, 2, 0, 0]} />
        <Bar dataKey="transgenre" name="Transgenres" fill={GENDER_COLORS.transgenre} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────
const PopulationsClesChart = ({ data, loading }) => {
  const { pieData: rawPieData = [], detail = {} } = data ?? {};

  // Normalisation des données du donut
  const pieData = Array.isArray(rawPieData)
    ? rawPieData.map((item, i) => ({
        name:  item?.name  ?? `Categorie ${i + 1}`,
        value: Number(item?.value) || 0,
        fill:  item?.fill  ?? "#8c8c8c",
      }))
    : [];

  const hasPieData = pieData.length > 0;

  // Construction des onglets du bar chart
  const tabItems = [
    { key: "all",         label: "Tous",        data: aggregateByGroup(detail), hideSex: false, isAll: true },
    { key: "hsh",         label: "HSH",         data: detail.hsh,               hideSex: true               },
    { key: "udi",         label: "UDI",         data: detail.udi,               hideSex: false              },
    { key: "ps",          label: "PS",          data: detail.ps,                hideSex: false              },
    { key: "transgenres", label: "Transgenres", data: detail.transgenres,       hideSex: true               },
  ]
    .filter((t) => t.data?.length)
    .map((t) =>
      t.isAll
        ? { key: t.key, label: t.label, children: <AggregatedBar data={t.data} /> }
        : { key: t.key, label: t.label, children: <DetailBar data={t.data} hideSex={t.hideSex} /> }
    );

  return (
    <Card
      title="Ventilation selon le profil des patients"
      size="small"
      loading={loading}
    >
      <Row gutter={[16, 16]} align="middle">

        {/* Donut — répartition globale par groupe */}
        <Col xs={24} md={8}>
          {hasPieData ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  stroke="#595959"
                  strokeWidth={1}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: "none" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Empty description="Aucune donnée" style={{ padding: "40px 0" }} />
          )}
        </Col>

        {/* Bar chart — drill-down par groupe / tranche d'âge */}
        <Col xs={24} md={16}>
          {tabItems.length > 0 ? (
            <Tabs size="small" defaultActiveKey="all" items={tabItems} />
          ) : (
            <Empty description="Aucun détail disponible" />
          )}
        </Col>

      </Row>
    </Card>
  );
};

export default PopulationsClesChart;