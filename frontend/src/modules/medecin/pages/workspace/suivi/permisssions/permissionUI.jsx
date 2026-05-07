import { DUREE_OPTIONS, MESSAGES } from "./permissionConstants";
import { getPermissionStatusMeta } from "./permissionHelpers";

export function PermissionToggle({ label, checked, onChange }) {
  return (
    <div className="permission-toggle">
      <span className="permission-toggle-label">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="permission-toggle-input"
      />
    </div>
  );
}

export function DureeSelect({ value, onChange }) {
  return (
    <div className="permission-duration">
      <label className="permission-duration-label">{MESSAGES.durationLabel}</label>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="permission-duration-select"
      >
        {DUREE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PermissionStatus({ permission }) {
  const status = getPermissionStatusMeta(permission);

  return (
    <div className={`permission-status permission-status-${status.tone}`}>
      {status.label}
    </div>
  );
}
