//cheked 15/04/2026
export const BILANS = [
  { key: "bilan_initial_complet",  label: "Bilan initial complet",   isMaster: true },
  { key: "serologie_vih",          label: "Sérologie VIH"                           },
  { key: "bilan_biochimique",      label: "Bilan biochimique"                       },
  { key: "serologie_vhb",          label: "Sérologie VHB"                           },
  { key: "nfs_complete",           label: "NFS complète"                            },
  { key: "charge_virale_vih",      label: "Charge Virale VIH"                       },
  { key: "cd4_cd8",                label: "CD4/CD8"                                 },
  { key: "bilan_lipidique",        label: "Bilan lipidique"                         },
  { key: "serologie_vha",          label: "Sérologie VHA"                           },
  { key: "serologie_vhc",          label: "Sérologie VHC"                           },
  { key: "serologie_syphilis",     label: "Sérologie syphilis"                               },
  { key: "serologie_toxoplasmose", label: "Sérologie toxoplasmose"                  },
  { key: "serologie_cmv",          label: "Sérologie CMV"                           },
  { key: "serologie_leishmaniose", label: "Sérologie leishmaniose"                  },
  { key: "idr_tuberculine",        label: "IDR à la tuberculine"                    },
  { key: "test_genotypage",        label: "Test de génotypage"                      },
  { key: "radio_thorax",           label: "Radio thorax"                            },
];

// ── Clés des bilans individuels (sans le master) ─────────────
export const ALL_BILAN_KEYS = BILANS
  .filter((b) => !b.isMaster)
  .map((b) => b.key);

// ── État initial du formulaire ────────────────────────────────
export const INITIAL_FORM = {
  bilan_initial_complet:   false,
  serologie_vih:           false,
  bilan_biochimique:       false,
  serologie_vhb:           false,
  nfs_complete:            false,
  charge_virale_vih:       false,
  cd4_cd8:                 false,
  bilan_lipidique:         false,
  serologie_vha:           false,
  serologie_vhc:           false,
  serologie_syphilis:      false,
  serologie_toxoplasmose:  false,
  serologie_cmv:           false,
  serologie_leishmaniose:  false,
  idr_tuberculine:         false,
  test_genotypage:         false,
  radio_thorax:            false,
  observations:            "",
};