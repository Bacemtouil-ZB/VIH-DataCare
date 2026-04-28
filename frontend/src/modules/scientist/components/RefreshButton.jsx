import { Space, Typography, Button, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const RefreshButton = ({ refreshing, onRefresh, lastRefreshedAt }) => (
  <Space>
    {lastRefreshedAt && (
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        MAJ : {new Date(lastRefreshedAt).toLocaleString("fr-FR")}
      </Typography.Text>
    )}
    <Tooltip title="Recalculer les données">
      <Button
        icon={<ReloadOutlined spin={refreshing} />}
        loading={refreshing}
        onClick={onRefresh}
        size="small"
      >
        Actualiser
      </Button>
    </Tooltip>
  </Space>
);

export default RefreshButton;