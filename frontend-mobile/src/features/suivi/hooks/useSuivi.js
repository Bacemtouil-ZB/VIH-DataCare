import { useEffect, useState } from "react";
import useAuthStore from "../../../store/authStore";
import useI18n from "../../../i18n/useI18n";
import { getGraphiqueCD4, getGraphiqueCV, getPeriodesARV } from "../../../api/suivi.api";

export const prepareDataCD4 = (points) => {
  if (!Array.isArray(points)) return [];

  return points.map((point) => ({
    ...point,
    x: new Date(point.date).getTime(),
    y: point.cd4_absolu,
  }));
};

export const prepareDataCV = (points) => {
  if (!Array.isArray(points)) return [];

  return points.map((point) => ({
    ...point,
    x: new Date(point.date).getTime(),
    y: point.charge_virale_valeur,
    yLog: point.charge_virale_valeur > 0 ? point.charge_virale_valeur : 1,
  }));
};

const INITIAL_GRAPH_STATE = {
  cd4: [],
  cv: [],
  periodes: [],
};

const INITIAL_PERMISSIONS = {
  can_view_cd4: true,
  can_view_viral_load: true,
};

const useSuivi = () => {
  const numero = useAuthStore((state) => state.user?.numero);
  const { t } = useI18n();

  const [graphiques, setGraphiques] = useState(INITIAL_GRAPH_STATE);
  const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!numero) return;

    const fetchGraphiques = async () => {
      setLoading(true);
      setError(null);

      try {
        const [resCD4, resCV, resPeriodes] = await Promise.all([
          getGraphiqueCD4(numero),
          getGraphiqueCV(numero),
          getPeriodesARV(numero),
        ]);

        setPermissions({
          can_view_cd4: !resCD4?.forbidden,
          can_view_viral_load: !resCV?.forbidden,
        });

        setGraphiques({
          cd4: prepareDataCD4(resCD4?.data),
          cv: prepareDataCV(resCV?.data),
          periodes: Array.isArray(resPeriodes?.data) ? resPeriodes.data : [],
        });
      } catch (err) {
        setError(err.message || t("suivi.loadError"));
        setGraphiques(INITIAL_GRAPH_STATE);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphiques();
  }, [numero, t]);

  return { graphiques, permissions, loading, error };
};

export default useSuivi;
