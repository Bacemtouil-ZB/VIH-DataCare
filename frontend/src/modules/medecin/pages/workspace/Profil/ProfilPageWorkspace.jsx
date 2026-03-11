import ProfilForm from "./ProfileForme.jsx";
import { useProfileLogic } from "./useProfileLogic";
import { PageTitle } from "../../../../../shared/components/layouts";

export default function ProfilPageWorkspace() {
  const logic = useProfileLogic();

  if (logic.loading) return <p>Chargement...</p>;

  return (
    <div className="medical-page">
      <PageTitle title={logic.isNew ? "Nouveau patient" : "Profil du patient"} />
      <ProfilForm {...logic} />
    </div>
  );
}
