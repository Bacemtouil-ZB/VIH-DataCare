import { Card, Empty } from "antd";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { GENDER_COLORS } from "../constants/chartColors";

const TotalFileActiveChart = ({ data, loading }) => (
  <Card
    title="File active — répartition par genre et tranche d'âge"
    size="small"
    loading={loading}
  >
    {!data?.length
      ? <Empty description="Aucune donnée" />
      : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 24, left: 16 }}>
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
            <Bar dataKey="homme"      name="Hommes"      fill={GENDER_COLORS.homme}      radius={[3,3,0,0]} />
            <Bar dataKey="femme"      name="Femmes"      fill={GENDER_COLORS.femme}      radius={[3,3,0,0]} />
            <Bar dataKey="transgenre" name="Transgenres" fill={GENDER_COLORS.transgenre} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }
  </Card>
);

export default TotalFileActiveChart;