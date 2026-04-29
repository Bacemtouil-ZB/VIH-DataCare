import { useInfoForm, usePwdForm } from "./Profil.hooks.js";
import { ProfileHeader, InfoSection, PasswordSection } from "./Profil.ui.jsx";
import { useAuth } from "../../shared/services/authService.jsx"; // your real hook

export default function ProfilPage() {
  const { user } = useAuth(); // get current logged-in user
  const infoForm = useInfoForm(user);
  const pwdForm  = usePwdForm();

  if (!user) return <div>Loading...</div>; // wait until user is loaded

  return (
    <div className="profil-page">
      <div className="profil-container">

        <ProfileHeader user={user} />

        <div className="profil-grid">
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