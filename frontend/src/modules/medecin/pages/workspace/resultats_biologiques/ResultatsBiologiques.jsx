// ── ResultatsBiologiques.jsx ─────────────────────────────────────────────────
// Point d'entrée — appelle le hook et passe tout à l'UI

import { useResultatsBiologiquesLogic } from "./useResultatsBiologiquesLogic";
import ResultatsBiologiquesUI from "./ResultatsBiologiquesUI";
import "./Resultatsbiologiques.css"

export default function ResultatsBiologiques() {
  const logic = useResultatsBiologiquesLogic();
  return <ResultatsBiologiquesUI {...logic} />;
}
