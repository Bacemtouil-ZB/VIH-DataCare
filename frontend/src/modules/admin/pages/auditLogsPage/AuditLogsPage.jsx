import AuditLogsPageUI from "./AuditLogsPageUI";
import { useAuditLogsPageLogic } from "./useAuditLogsPageLogic";
import "./auditLogsPage.css";

const AuditLogsPage = () => {
  const logic = useAuditLogsPageLogic();

  return (
    <AuditLogsPageUI
      patientNumeroInput={logic.patientNumeroInput}
      setPatientNumeroInput={logic.setPatientNumeroInput}
      module={logic.module}
      setModule={logic.setModule}
      action={logic.action}
      setAction={logic.setAction}
      from={logic.from}
      setFrom={logic.setFrom}
      to={logic.to}
      setTo={logic.setTo}
      loading={logic.loading}
      logs={logic.logs}
      total={logic.total}
      page={logic.page}
      totalPages={logic.totalPages}
      detailsOpen={logic.detailsOpen}
      detailsLoading={logic.detailsLoading}
      details={logic.details}
      diffRows={logic.diffRows}
      modules={logic.modules}
      actionsForModule={logic.actionsForModule}
      onSearch={logic.onSearch}
      openDetails={logic.openDetails}
      closeDetails={logic.closeDetails}
      onReset={logic.onReset}
      next={logic.next}
      prev={logic.prev}
      setOffset={logic.setOffset}
    />
  );
};

export default AuditLogsPage;
