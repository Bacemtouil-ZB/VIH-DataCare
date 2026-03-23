// ─── ProfilPage.jsx (Orchestrator) ────────────────────────────────────────────
// This is the only file imported by the router.
// Its sole responsibility: wire hooks → UI, nothing else.

import { useInfoForm, usePwdForm } from "./profil.hooks";
import {
  ProfileHeader,
  InfoSection,
  PasswordSection,
} from "./Profil.ui.jsx";


// Replace with your real auth hook: import { useAuth } from "@/context/AuthContext"
const useCurrentUser = () => ({
  id: 1,
  nom: "Benali",
  prenom: "Karim",
  email: "k.benali@clinique.dz",
  role: "medecin",
  isactivated: true,
  created_at: "2024-01-15T09:00:00Z",
});

export default function ProfilPage() {
  const user = useCurrentUser();

  const infoForm = useInfoForm(user);
  const pwdForm  = usePwdForm();

  return (
    <div style={S.page}>
      <div style={S.container}>

        <ProfileHeader user={user} />

        <div style={S.grid}>
          <InfoSection
            form={infoForm.form}
            errors={infoForm.errors}
            loading={infoForm.loading}
            isDirty={infoForm.isDirty}
            setField={infoForm.setField}
            onSubmit={infoForm.handleSubmit}
          />

          <PasswordSection
            form={pwdForm.form}
            errors={pwdForm.errors}
            loading={pwdForm.loading}
            visibility={pwdForm.visibility}
            setField={pwdForm.setField}
            toggleVisibility={pwdForm.toggleVisibility}
            onSubmit={pwdForm.handleSubmit}
          />
        </div>

      </div>
    </div>
  );
}