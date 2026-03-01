const SECTIONS = [
  { id: "medical", label: "Médicaux" },
  { id: "infectious", label: "Infectieux" },
  { id: "therapeutic", label: "Thérapeutique" },
  { id: "surgical", label: "Chirurgicaux" },
  { id: "transfusion", label: "Transfusions" },
  { id: "aes", label: "AES" },
  { id: "gyneco", label: "Gynéco-Obstétrical" },
  { id: "family", label: "Familiaux" },
];

const BOOL_FIELDS = {
  medical: [
    { key: "diabete", label: "Diabète" },
    { key: "hypertension", label: "Hypertension" },
    { key: "cardiopathies", label: "Cardiopathies" },
    { key: "insuffisance_renale", label: "Insuffisance rénale" },
    { key: "maladies_hepatiques", label: "Maladies hépatiques" },
    { key: "asthme_bpco", label: "Asthme / BPCO" },
    { key: "cancers", label: "Cancers" },
  ],
  infectious: [
    { key: "tuberculose", label: "Tuberculose" },
    { key: "hepatites_virales", label: "Hépatites virales" },
    { key: "syphilis", label: "Syphilis" },
    { key: "gonococcie", label: "Gonococcie" },
    { key: "chlamydia", label: "Chlamydia" },
    { key: "pneumocystose", label: "Pneumocystose" },
    { key: "toxoplasmose", label: "Toxoplasmose" },
    { key: "candidoses_severes", label: "Candidoses sévères" },
    { key: "zona_recidivant", label: "Zona récidivant" },
  ],
  family: [
    { key: "diabete", label: "Diabète" },
    { key: "hypertension", label: "Hypertension" },
    { key: "cardiopathies", label: "Cardiopathies" },
    { key: "insuffisance_renale", label: "Insuffisance rénale" },
    { key: "maladies_hepatiques", label: "Maladies hépatiques" },
    { key: "asthme_bpco", label: "Asthme / BPCO" },
    { key: "cancers", label: "Cancers" },
  ],
};

const initialState = {
  medical: { diabete: false, hypertension: false, cardiopathies: false, insuffisance_renale: false, maladies_hepatiques: false, asthme_bpco: false, cancers: false, autres: "" },
  infectious: { tuberculose: false, hepatites_virales: false, syphilis: false, gonococcie: false, chlamydia: false, pneumocystose: false, toxoplasmose: false, candidoses_severes: false, zona_recidivant: false },
  therapeutic: { medicaments_chroniques: "", automedication: "", medecines_traditionnelles: "", allergies_medicaments: "" },
  surgical: [{ description: "", date_intervention: "" }],
  transfusion: [{ date_transfusion: "" }],
  aes: [{ date_aes: "" }],
  gyneco: { gestite: "", parite: "", avortement: "", complications: "", suivi_gynecologique: "", depistage_cancer_col: "" },
  family: { diabete: false, hypertension: false, cardiopathies: false, insuffisance_renale: false, maladies_hepatiques: false, asthme_bpco: false, cancers: false, autres: "" },
};