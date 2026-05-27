// import { DUREE_OPTIONS } from "./permissionConstants";
// import { formatExpiration, isExpired } from "./permissionHelpers";

// export const PermissionToggle = ({ label, checked, onChange }) => (
//   <div style={{
//     display:        "flex",
//     justifyContent: "space-between",
//     alignItems:     "center",
//     padding:        "14px 0",
//     borderBottom:   "1px solid #f0f0f0",
//   }}>
//     <span style={{ fontSize: 14 }}>{label}</span>
//     <input
//       type="checkbox"
//       checked={checked}
//       onChange={(e) => onChange(e.target.checked)}
//       style={{ width: 18, height: 18, cursor: "pointer" }}
//     />
//   </div>
// );

// export const DureeSelect = ({ value, onChange }) => (
//   <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
//     <label style={{ fontSize: 13, color: "#666" }}>Durée de validité</label>
//     <select
//       value={value}
//       onChange={(e) => onChange(Number(e.target.value))}
//       style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd" }}
//     >
//       {DUREE_OPTIONS.map((opt) => (
//         <option key={opt.value} value={opt.value}>{opt.label}</option>
//       ))}
//     </select>
//   </div>
// );

// export const PermissionStatus = ({ permission }) => {
  
// if (!permission || (!permission.can_view_viral_load && !permission.can_view_cd4)) {
//   return <div style={{ fontSize: 13, color: "#999", marginTop: 8 }}>
//     Aucune autorisation enregistrée
//   </div>;
// }

//   const expired = isExpired(permission.expires_at);

//   return (
//     <div style={{
//       fontSize:     13,
//       color:        expired ? "#e53e3e" : "#38a169",
//       marginTop:    8,
//       padding:      "8px 12px",
//       borderRadius: 6,
//       background:   expired ? "#fff5f5" : "#f0fff4",
//     }}>
//       {expired ? "Expirée" : "Active"} — expire le {formatExpiration(permission.expires_at)}
//     </div>
//   );
// };


import {
  formatExpiration,
  isExpired,
} from "./permissionHelpers";

import { DUREE_OPTIONS } from "./permissionConstants";

export const PermissionToggle = ({
  label,
  checked,
  onChange,
  icon,
}) => (
  <div className="perm-toggle">

    <div className="perm-toggle-left">

        <div className="perm-toggle-icon">
          <i className={icon}></i>
        </div>

      <span>{label}</span>

    </div>

    <label className="switch">

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      <span className="slider"></span>

    </label>

  </div>
);

export const DureeSelect = ({
  value,
  onChange,
}) => (
  <div className="perm-duration">

    <label>Durée</label>

    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {DUREE_OPTIONS.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
        >
          {opt.label}
        </option>
      ))}
    </select>

  </div>
);

export const PermissionStatus = ({ permission }) => {

  if (
    !permission ||
    (
      !permission.can_view_viral_load &&
      !permission.can_view_cd4
    )
  ) {
    return (
      <div className="perm-status none">
        Aucune autorisation enregistrée
      </div>
    );
  }

  const expired = isExpired(permission.expires_at);

  return (
    <div className={`perm-status ${expired ? "expired" : "active"}`}>
      {expired ? "Expirée" : "Active"} —
      expire le {formatExpiration(permission.expires_at)}
    </div>
  );
};