

import { useResultatsBiologiquesLogic } from "./useResultatsBiologiquesLogic";
import ResultatsBiologiquesUI from "./ResultatsBiologiquesUI";
import "./Resultatsbiologiques.css"

export default function ResultatsBiologiques() {
  const logic = useResultatsBiologiquesLogic();
  return <ResultatsBiologiquesUI {...logic} />;
}