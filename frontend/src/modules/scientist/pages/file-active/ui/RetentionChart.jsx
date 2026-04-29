import { Card, Empty } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { RETENTION_COLORS } from "../constants/chartColors";

// data : [{ tranche, perdu_de_vue, recupere }] — déjà formaté par le backend
const RetentionChart = ({ data, loading }) => (
  <Card
    title="Rétention — perdus de vue vs récupérés"
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
            <Bar dataKey="perdu_de_vue" name="Perdus de vue" fill={RETENTION_COLORS.perdu_de_vue} radius={[3,3,0,0]} />
            <Bar dataKey="recupere"     name="Récupérés"     fill={RETENTION_COLORS.recupere}     radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  </Card>
);

export default RetentionChart;