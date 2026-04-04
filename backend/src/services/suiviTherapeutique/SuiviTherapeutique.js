const MS_PER_DAY = 1000 * 60 * 60 * 24;

export class SuiviTherapeutique {
  constructor(dateProchainePrise, referenceDate = new Date()) {
    this.dateProchainePrise = dateProchainePrise ? new Date(dateProchainePrise) : null;
    this.referenceDate = new Date(referenceDate);
    this.referenceDate.setHours(0, 0, 0, 0);
  }

  get ecartJours() {
    if (!this.dateProchainePrise || Number.isNaN(this.dateProchainePrise.getTime())) {
      return 0;
    }
    const next = new Date(this.dateProchainePrise);
    next.setHours(0, 0, 0, 0);
    // Positif = patient en retard (date prochaine prise dépassée)
    return Math.floor((this.referenceDate - next) / MS_PER_DAY);
  }

  get statutPatient() {
    return this.ecartJours > 60 ? "perdue de vue" : "actif";
  }

  get dateEcart() {
    return this.ecartJours > 0 ? this.ecartJours : 0;
  }

  toJSON() {
    return {
      statut_patient: this.statutPatient,
      ecart_jours:    this.ecartJours,
      date_ecart:     this.dateEcart,
    };
  }

  /**
   * Calcule la date de prochaine prise.
   *
   * Scénario 1 (validation sans modification) :
   *   periodeJours = periode prescrite par le médecin
   *
   * Scénario 2 (validation avec modification) :
   *   periodeJours = periode_modifiee insérée par le pharmacien
   *                  (TOUJOURS prioritaire sur la période du médecin)
   *
   * @param {Date|string} dateDelivrance  - Date de délivrance (date système au moment de la validation)
   * @param {number}      periodeJours    - Nombre de jours (période effective retenue)
   * @returns {Date}
   */
  static calculerDateProchainePrise(dateDelivrance, periodeJours) {
    const base = new Date(dateDelivrance);
    base.setHours(0, 0, 0, 0);

    const jours = Number.parseInt(periodeJours, 10);
    if (!jours || jours <= 0) {
      throw new Error(
        `Période invalide pour calculer la prochaine prise : "${periodeJours}"`,
      );
    }

    const prochaine = new Date(base);
    prochaine.setDate(prochaine.getDate() + jours);
    return prochaine;
  }
}