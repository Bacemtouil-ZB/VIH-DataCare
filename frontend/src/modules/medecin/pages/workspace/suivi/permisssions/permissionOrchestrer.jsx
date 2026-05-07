import { useParams } from "react-router-dom";
import { usePermission } from "./usePermission";
import {
  PermissionToggle,
  DureeSelect,
  PermissionStatus,
} from "./permissionUI";
import {
  PERMISSION_LABELS,
  MESSAGES,
} from "./permissionConstants";

const PermissionOrchestrer = () => {
  const { numero } = useParams();

  const {
    canViewViralLoad,
    setCanViewViralLoad,
    canViewCd4,
    setCanViewCd4,
    dureeMonths,
    setDureeMonths,
    loading,
    saving,
    error,
    successMsg,
    currentPermission,
    handleSave,
  } = usePermission(numero);

  if (loading) {
    return <div className="permission-page">{MESSAGES.loading}</div>;
  }

  return (
    <div className="permission-page">
      <h3 className="permission-title">{MESSAGES.title}</h3>

      <PermissionStatus permission={currentPermission} />

      <div className="permission-toggle-list">
        <PermissionToggle
          label={PERMISSION_LABELS.canViewViralLoad}
          checked={canViewViralLoad}
          onChange={setCanViewViralLoad}
        />
        <PermissionToggle
          label={PERMISSION_LABELS.canViewCd4}
          checked={canViewCd4}
          onChange={setCanViewCd4}
        />
      </div>

      <DureeSelect
        value={dureeMonths}
        onChange={setDureeMonths}
      />

      {error && (
        <p className="permission-feedback permission-feedback-error">{error}</p>
      )}
      {successMsg && (
        <p className="permission-feedback permission-feedback-success">{successMsg}</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="permission-save-button"
      >
        {saving ? MESSAGES.saving : MESSAGES.save}
      </button>
    </div>
  );
};

export default PermissionOrchestrer;
