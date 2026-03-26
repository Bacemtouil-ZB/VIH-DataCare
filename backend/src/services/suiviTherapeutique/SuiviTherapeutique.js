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
      ecart_jours: this.ecartJours,
      date_ecart: this.dateEcart,
    };
  }

  static calculerDateProchainePrise(dateDepart, quantiteMois) {
    const baseDate = new Date(dateDepart);
    baseDate.setHours(0, 0, 0, 0);

    const months = Number.parseInt(quantiteMois, 10);
    if (!months || months <= 0) {
      throw new Error("Quantite prescrite invalide pour calculer la prochaine prise");
    }

    const prochaine = new Date(baseDate);
    prochaine.setMonth(prochaine.getMonth() + months);
    return prochaine;
  }
}
