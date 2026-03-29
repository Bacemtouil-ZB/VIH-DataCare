import { useProfileLogic } from "./useProfileLogic";
import { PageTitle } from "../../../../../shared/components";
import MobileAccessSection from "./mobileAccessSection/mobileAccessSection.jsx";
import ProfilForm from "./ProfileForme.jsx";

export default function ProfilPageWorkspace() {
  const logic = useProfileLogic();

  return (
    <div className="medical-page">

      {/*  HEADER PRO */}
      <div className="page-header">
        <PageTitle
          title={logic.isNew ? "Nouveau patient" : "Profil du patient"}
        />

        {/*  Button Mobile Access ici */}
        {!logic.isNew && (
          <MobileAccessSection numero={logic.formData?.numero} />
        )}
      </div>

      {/* Form */}
      <ProfilForm {...logic} />

    </div>
  );
}