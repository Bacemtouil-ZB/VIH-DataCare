import { useState, useEffect } from "react";
import { getPermission, setPermission } from "../../../../services/permissionService";
import { computeExpiresAt } from "./permissionHelpers";
import { MESSAGES } from "./permissionConstants";

export const usePermission = (numero) => {
  const [canViewViralLoad, setCanViewViralLoad] = useState(false);
  const [canViewCd4, setCanViewCd4] = useState(false);
  const [dureeMonths, setDureeMonths] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [currentPermission, setCurrentPermission] = useState(null);

  useEffect(() => {
    if (!numero) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPermission(numero);

        if (response.data) {
          setCanViewViralLoad(response.data.can_view_viral_load);
          setCanViewCd4(response.data.can_view_cd4);
          setCurrentPermission(response.data);
        }
      } catch {
        setError(MESSAGES.loadError);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [numero]);

  // Remplace ton useEffect par celui-ci
useEffect(() => {
  if (!canViewViralLoad && !canViewCd4) {
    setCurrentPermission(null);
  }
}, [canViewViralLoad, canViewCd4]);


  // const handleSave = async () => {
  //   try {
  //     setSaving(true);
  //     setError(null);
  //     setSuccessMsg(null);

  //     const expiresAt = computeExpiresAt(dureeMonths);
  //     const response = await setPermission({
  //       numero,
  //       canViewViralLoad,
  //       canViewCd4,
  //       expiresAt,
  //     });

  //     setCurrentPermission(response.data);
  //     setSuccessMsg(MESSAGES.success);
  //   } catch {
  //     setError(MESSAGES.error);
  //   } finally {
  //     setSaving(false);
  //   }
  // };
const handleSave = async () => {
  // reset les 2 avant tout
  setError(null);
  setSuccessMsg(null);

  if (!canViewViralLoad && !canViewCd4) {
    setError("Veuillez sélectionner au moins une autorisation");
    return;
  }

  try {
    setSaving(true);

    const expiresAt = computeExpiresAt(dureeMonths);
    const response = await setPermission({
      numero,
      canViewViralLoad,
      canViewCd4,
      expiresAt,
    });

    setCurrentPermission(response.data);
    setSuccessMsg(MESSAGES.success);

    // ← auto clear après 3 secondes
    setTimeout(() => setSuccessMsg(null), 3000);

  } catch {
    setError(MESSAGES.error);
  } finally {
    setSaving(false);
  }
};

  return {
    canViewViralLoad,
    setCanViewViralLoad,
    canViewCd4,
    setCanViewCd4,
    dureeMonths,
    setDureeMonths,
    loading,
    saving,
    error,
    successMsg,
    currentPermission,
    handleSave,
  };
};
