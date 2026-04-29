// cheked 15/04/2026
import { useParams } from "react-router-dom";
import { useVihLogic } from "./useVihLogic";
import VihUI from "./VihUI";

export default function VihPage() {
  const { numero } = useParams();
  const logic = useVihLogic(numero);

  return <VihUI {...logic} />;
}
