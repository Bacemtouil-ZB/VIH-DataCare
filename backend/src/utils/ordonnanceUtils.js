/**
 * Calcule le statut et le nombre de jours de retard
 * Utilisé partout dans le backend pour éviter la redondance
 * 
 * @param {Date|string} dateProchainePrise - Date de la prochaine prise
 * @returns {Object} { statut_calcule, jours_retard }
 */
export const calculerStatutOrdonnance = (dateProchainePrise) => {
  // Pas de date = statut par défaut
  if (!dateProchainePrise) {
    return {
      statut_calcule: "en cours de suivi",
      jours_retard: 0
    };
  }

  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);

  const dateEcheance = new Date(dateProchainePrise);
  dateEcheance.setHours(0, 0, 0, 0);

  // Calcul de la différence en jours
  const diffJours = Math.floor((aujourd_hui - dateEcheance) / (1000 * 60 * 60 * 24));

  // Date dans le futur (négatif)
  if (diffJours < 0) {
    return {
      statut_calcule: "actif",
      jours_retard: 0
    };
  }

  // Aujourd'hui ou quelques jours de retard
  if (diffJours <= 7) {
    return {
      statut_calcule: "actif",
      jours_retard: diffJours
    };
  }

  // Retard > 6 mois (180 jours) = perdu de vue
  if (diffJours > 180) {
    return {
      statut_calcule: "perdu de vue",
      jours_retard: diffJours
    };
  }

  // Retard entre 8 et 180 jours
  return {
    statut_calcule: `retard de ${diffJours} jours`,
    jours_retard: diffJours
  };
};