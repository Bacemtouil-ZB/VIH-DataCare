import "./auditLogsPage.css";
import { useAuditLogsPageLogique } from "./logique";
import AuditLogsPageUI from "./ui";

const AuditLogsPage = () => {
  const logic = useAuditLogsPageLogique();
  return <AuditLogsPageUI logic={logic} />;
};

export default AuditLogsPage;