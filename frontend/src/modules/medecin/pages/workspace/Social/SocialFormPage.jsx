import SocialForm from "./SocialForm.jsx";
import { useSocialLogic } from "./useSocialLogic.js";
import { PageTitle } from "../../../../../shared/components";
import {
  PROBLEME_OPTIONS,
  NIVEAU_ETUDE_OPTIONS,
  ACTIVITE_OPTIONS,
  SITUATION_SOCIAL_OPTIONS,
} from "./socialForm.constants.js";

export default function SocialFormPage() {
  const logic = useSocialLogic();

  return (
    <div className="medical-page">
      <PageTitle title={logic.ficheExists ? "Fiche sociale" : "Nouvelle fiche sociale"} />
      <SocialForm
        {...logic}
        problemeOptions={PROBLEME_OPTIONS}
        niveauEtudeOptions={NIVEAU_ETUDE_OPTIONS}
        activiteOptions={ACTIVITE_OPTIONS}
        situationSocialOptions={SITUATION_SOCIAL_OPTIONS}
      />
    </div>
  );
}
