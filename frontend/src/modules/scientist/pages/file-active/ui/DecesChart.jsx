import { Card, Empty } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { DECES_COLORS } from "../constants/chartColors";

// Fusionne sida + normaux en un seul tableau par tranche
const mergeDecesByTranche = (sida = [], normaux = []) => {
  const map = {};
  for (const row of sida) {
    map[row.tranche] = {
      tranche: row.tranche,
      decede_sida:    row.total ?? 0,
      decede_normale: 0,
    };
  }
  for (const row of normaux) {
    if (!map[row.tranche]) {
      map[row.tranche] = { tranche: row.tranche, decede_sida: 0, decede_normale: 0 };
    }
    map[row.tranche].decede_normale = row.total ?? 0;
  }
  return Object.values(map);
};

const DecesChart = ({ decesSida, decesNormaux, loading }) => {
  const data = mergeDecesByTranche(decesSida, decesNormaux);

  return (
    <Card
      title="Décès — liés au SIDA vs causes normales"
      size="small"
      loading={loading}
    >
      {!data?.length
        ? <Empty description="Aucune donnée" />
        : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 16 }}>
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
              <Bar dataKey="decede_sida"    name="Décès SIDA"   fill={DECES_COLORS.decede_sida}    radius={[3,3,0,0]} />
              <Bar dataKey="decede_normale" name="Décès normaux" fill={DECES_COLORS.decede_normale} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      }
    </Card>
  );
};

export default DecesChart;