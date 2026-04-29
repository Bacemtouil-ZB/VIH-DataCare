import { useState, useEffect } from "react";
import { getPermission, setPermission } from "../../../../services/permissionService";
import { computeExpiresAt } from "./permissionHelpers";

export const usePermission = (numero) => {
  const [canViewViralLoad,  setCanViewViralLoad]  = useState(false);
  const [canViewCd4,        setCanViewCd4]        = useState(false);
  const [dureeMonths,       setDureeMonths]       = useState(3);
  const [loading,           setLoading]           = useState(true);
  const [saving,            setSaving]            = useState(false);
  const [error,             setError]             = useState(null);
  const [successMsg,        setSuccessMsg]        = useState(null);
  const [currentPermission, setCurrentPermission] = useState(null);

  useEffect(() => {
    if (!numero) return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await getPermission(numero);
        if (res.data) {
          setCanViewViralLoad(res.data.can_view_viral_load);
          setCanViewCd4(res.data.can_view_cd4);
          setCurrentPermission(res.data);
        }
      } catch {
        setError("Erreur chargement des autorisations");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [numero]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const expiresAt = computeExpiresAt(dureeMonths);

      const res = await setPermission({
        numero,
        canViewViralLoad,
        canViewCd4,
        expiresAt,
      });

      setCurrentPermission(res.data);
      setSuccessMsg("Autorisations enregistrées avec succès");
    } catch {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return {
    canViewViralLoad, setCanViewViralLoad,
    canViewCd4,       setCanViewCd4,
    dureeMonths,      setDureeMonths,
    loading,
    saving,
    error,
    successMsg,
    currentPermission,
    handleSave,
  };
};