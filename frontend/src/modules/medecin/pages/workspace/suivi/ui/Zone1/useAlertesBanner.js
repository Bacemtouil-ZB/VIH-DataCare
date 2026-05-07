import { useMemo, useState } from "react";
import { getVisibleAlertes } from "./alertesBannerHelpers";

export const useAlertesBanner = (alertes = []) => {
  const [dismissed, setDismissed] = useState([]);

  const visibleAlertes = useMemo(
    () => getVisibleAlertes(alertes, dismissed),
    [alertes, dismissed]
  );

  const dismissAlerte = (index) => {
    setDismissed((previous) =>
      previous.includes(index) ? previous : [...previous, index]
    );
  };

  return {
    visibleAlertes,
    dismissAlerte,
  };
};
