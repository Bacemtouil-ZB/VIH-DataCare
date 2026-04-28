import { Select, Space, Typography } from "antd";
import RefreshButton from "../../../components/RefreshButton";

const TRIMESTRES = [
  { label: "Annuel", value: "" },
  { label: "Trimestre 1", value: "1" },
  { label: "Trimestre 2", value: "2" },
  { label: "Trimestre 3", value: "3" },
  { label: "Trimestre 4", value: "4" },
];

const FilterBar = ({
  annees,
  annee,
  onAnneeChange,
  trimestre,
  onTrimestreChange,
  refreshing,
  onRefresh,
  lastRefreshedAt,
}) => (
  <Space style={{ width: "100%", justifyContent: "space-between" }}>

    {/* LEFT FILTERS */}
    <Space>
      <Typography.Text strong>Période :</Typography.Text>

      <Select
        value={annee ?? undefined}
        onChange={onAnneeChange}
        options={annees.map((a) => ({ label: String(a), value: a }))}
        style={{ width: 120 }}
        placeholder="Année"
      />

      <Select
        value={trimestre ?? ""}
        onChange={onTrimestreChange}
        options={TRIMESTRES}
        style={{ width: 110 }}
      />
    </Space>

    {/* RIGHT REFRESH */}
    <RefreshButton
      refreshing={refreshing}
      onRefresh={onRefresh}
      lastRefreshedAt={lastRefreshedAt}
    />

  </Space>
);

export default FilterBar;