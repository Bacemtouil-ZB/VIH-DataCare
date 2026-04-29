import { useState, useEffect } from "react";
import { getDateEstimeeByNumero } from "../../../services/suiviNotificationService";

export function useDateEstimee(numero) {
  const [dateEstimee, setDateEstimee]   = useState(null);
  const [loading,     setLoading]       = useState(true);

  useEffect(() => {
    if (!numero) return;

    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getDateEstimeeByNumero(numero);
        
        setDateEstimee(
          data
            ? {
                date:       data.date_prochaine_prise,
                traitement: data.nom_traitement || "Aucun",
              }
            : null,
        );
      } catch (err) {
        console.error("Erreur useDateEstimee:", err);
        setDateEstimee(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [numero]);

  return { dateEstimee, loading };
}