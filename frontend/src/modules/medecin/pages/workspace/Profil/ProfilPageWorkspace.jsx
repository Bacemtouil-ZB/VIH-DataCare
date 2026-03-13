import ProfilForm from "./ProfileForme.jsx";
import { useProfileLogic } from "./useProfileLogic";
import { PageTitle } from "../../../../../shared/components";

export default function ProfilPageWorkspace() {
  const logic = useProfileLogic();

  return (
    <div className="medical-page">
      <PageTitle title={logic.isNew ? "Nouveau patient" : "Profil du patient"} />
      <ProfilForm {...logic} />
    </div>
  );
}
