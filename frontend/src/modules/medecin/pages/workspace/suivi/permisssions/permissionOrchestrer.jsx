// import { useParams }       from "react-router-dom";
// import { usePermission }   from "./usePermission";
// import {
//   PermissionToggle,
//   DureeSelect,
//   PermissionStatus,
// } from "./permissionUI";
// import {
//   PERMISSION_LABELS,
//   MESSAGES,
// }  from "./permissionConstants";

// const PermissionOrchestrer = () => {
//   const { numero } = useParams();

//   const {
//     canViewViralLoad, setCanViewViralLoad,
//     canViewCd4,       setCanViewCd4,
//     dureeMonths,      setDureeMonths,
//     loading,
//     saving,
//     error,
//     successMsg,
//     currentPermission,
//     handleSave,
//   } = usePermission(numero);

//   if (loading) return <div>{MESSAGES.loading}</div>;

//   return (
//     <div style={{ maxWidth: 480, padding: 24 }}>

//       <h3 style={{ marginBottom: 8, fontSize: 16, fontWeight: 500 }}>
//         Autorisations patient
//       </h3>

//       <PermissionStatus permission={currentPermission} />

//       <div style={{ marginTop: 20 }}>
//         <PermissionToggle
//           label={PERMISSION_LABELS.canViewViralLoad}
//           checked={canViewViralLoad}
//           onChange={setCanViewViralLoad}
//         />
//         <PermissionToggle
//           label={PERMISSION_LABELS.canViewCd4}
//           checked={canViewCd4}
//           onChange={setCanViewCd4}
//         />
//       </div>

//       <DureeSelect
//         value={dureeMonths}
//         onChange={setDureeMonths}
//       />

//       {error      && <p style={{ color: "#e53e3e", marginTop: 12, fontSize: 13 }}>{error}</p>}
//       {successMsg && <p style={{ color: "#38a169", marginTop: 12, fontSize: 13 }}>{successMsg}</p>}

//       <button
//         onClick={handleSave}
//         disabled={saving}
//         style={{
//           marginTop:    24,
//           padding:      "10px 28px",
//           background:   "#1D9E75",
//           color:        "white",
//           border:       "none",
//           borderRadius: 8,
//           fontSize:     14,
//           cursor:       saving ? "not-allowed" : "pointer",
//           opacity:      saving ? 0.7 : 1,
//         }}
//       >
//         {saving ? "Enregistrement..." : "Enregistrer"}
//       </button>

//     </div>
//   );
// };

// export default PermissionOrchestrer;


import { useParams } from "react-router-dom";
import { usePermission } from "./usePermission";
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
  PermissionToggle,
  DureeSelect,
  PermissionStatus,
} from "./permissionUI";

import {
  PERMISSION_LABELS,
  MESSAGES,
} from "./permissionConstants";

import "./permissionOrchestrer.css";

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
    return (
      <div className="perm-loading">
        {MESSAGES.loading}
      </div>
    );
  }

  return (
    <div className="perm-page">

      <div className="perm-card">

        <div className="perm-header">
          <h2>Autorisations patient</h2>
          <p>
            Gérer les accès aux données médicales du patient
          </p>
        </div>

        <PermissionStatus permission={currentPermission} />

        <div className="perm-section">

          <PermissionToggle
            label={PERMISSION_LABELS.canViewViralLoad}
            checked={canViewViralLoad}
            onChange={setCanViewViralLoad}
            icon="bi bi-virus"
          />

          <PermissionToggle
            label={PERMISSION_LABELS.canViewCd4}
            checked={canViewCd4}
            onChange={setCanViewCd4}
            icon="bi bi-bar-chart-line"
          />

        </div>

        <div className="perm-footer">

          <DureeSelect
            value={dureeMonths}
            onChange={setDureeMonths}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="perm-save-btn"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>

        </div>

        {error && (
          <div className="perm-message error">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="perm-message success">
            {successMsg}
          </div>
        )}

      </div>

    </div>
  );
};

export default PermissionOrchestrer;