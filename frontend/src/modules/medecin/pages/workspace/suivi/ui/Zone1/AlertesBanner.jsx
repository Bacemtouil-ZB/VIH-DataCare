// ============================================================
//  AlertesBanner.jsx
//  Zone 1 — Bannière alertes critiques
//  Reçoit: alertes[] = [{ type: "danger"|"warning", message }]
// ============================================================

import { Alert, Space } from "antd";

const AlertesBanner = ({ alertes = [] }) => {
  if (!alertes || alertes.length === 0) return null;

  return (
    <Space direction="vertical" style={{ width: "100%", marginBottom: 16 }}>
      {alertes.map((alerte, index) => (
        <Alert
          key={index}
          type={alerte.type === "danger" ? "error" : "warning"}
          message={alerte.message}
          showIcon
          banner
        />
      ))}
    </Space>
  );
};

export default AlertesBanner;