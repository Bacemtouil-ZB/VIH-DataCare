// import React from 'react'

// const Conclusion = () => {
//   return (
//     <div className='p-4'>
//         <h1>Conclusion</h1>
//     </div>
//   )
// }

// export default Conclusion
<svg xmlns="http://www.w3.org/2000/svg" width="2480" height="3508" viewBox="0 0 2480 3508">
  <defs>
    <style>
      .bg { fill: #f6f7fb; }
      .card { fill: #ffffff; stroke: #d7dbe7; stroke-width: 3; }
      .muted { fill: #6b7280; font-family: Arial, Helvetica, sans-serif; font-size: 34px; }
      .h1 { fill: #111827; font-family: Arial, Helvetica, sans-serif; font-size: 64px; font-weight: 700; }
      .h2 { fill: #111827; font-family: Arial, Helvetica, sans-serif; font-size: 44px; font-weight: 700; }
      .label { fill: #374151; font-family: Arial, Helvetica, sans-serif; font-size: 34px; font-weight: 700; }
      .text { fill: #111827; font-family: Arial, Helvetica, sans-serif; font-size: 34px; }
      .btn { fill: #2563eb; }
      .btn2 { fill: #111827; opacity: 0.08; }
      .btnText { fill: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 32px; font-weight: 700; }
      .btnTextDark { fill: #111827; font-family: Arial, Helvetica, sans-serif; font-size: 32px; font-weight: 700; }
      .pill { fill: #eef2ff; stroke: #c7d2fe; stroke-width: 2; }
      .pillText { fill: #3730a3; font-family: Arial, Helvetica, sans-serif; font-size: 30px; font-weight: 700; }
      .tableHead { fill: #f3f4f6; stroke: #d1d5db; stroke-width: 2; }
      .grid { stroke: #e5e7eb; stroke-width: 2; }
    </style>
  </defs>

  <!-- Background -->
  <rect class="bg" x="0" y="0" width="2480" height="3508"/>

  <!-- Header -->
  <rect class="card" x="90" y="80" width="2300" height="230" rx="22"/>
  <text class="h1" x="140" y="170">Prescription d’examens — Profil VIH (PvVIH)</text>
  <text class="muted" x="140" y="220">Patient: NOM Prénom • IPP: 123456 • Date: 2026-03-05 • Service: Médecine</text>

  <!-- Action bar -->
  <rect class="card" x="90" y="340" width="2300" height="140" rx="22"/>
  <rect class="btn" x="140" y="372" width="260" height="76" rx="16"/>
  <text class="btnText" x="170" y="424">Nouveau bilan</text>

  <rect class="btn2" x="420" y="372" width="260" height="76" rx="16"/>
  <text class="btnTextDark" x="450" y="424">Ajouter examen</text>

  <rect class="btn2" x="700" y="372" width="520" height="76" rx="16"/>
  <text class="muted" x="730" y="424">Rechercher… (ex: CD4, Charge virale)</text>

  <rect class="btn2" x="1250" y="372" width="220" height="76" rx="16"/>
  <text class="btnTextDark" x="1310" y="424">Imprimer</text>

  <rect class="btn2" x="1490" y="372" width="240" height="76" rx="16"/>
  <text class="btnTextDark" x="1560" y="424">Exporter PDF</text>

  <rect class="btn" x="1760" y="372" width="220" height="76" rx="16"/>
  <text class="btnText" x="1825" y="424">Valider</text>

  <rect class="btn2" x="2000" y="372" width="200" height="76" rx="16"/>
  <text class="btnTextDark" x="2058" y="424">Annuler</text>

  <!-- Left panel: Bilans -->
  <rect class="card" x="90" y="520" width="640" height="2350" rx="22"/>
  <text class="h2" x="140" y="610">Bilans (packs)</text>
  <text class="muted" x="140" y="660">Choisir un protocole VIH</text>

  <!-- Pack items -->
  <!-- Item 1 -->
  <rect class="pill" x="140" y="720" width="540" height="130" rx="18"/>
  <text class="pillText" x="170" y="780">Bilan VIH — Initial / Confirmation</text>
  <text class="muted" x="170" y="825">Diagnostic + co-infections</text>

  <!-- Item 2 -->
  <rect class="pill" x="140" y="880" width="540" height="130" rx="18"/>
  <text class="pillText" x="170" y="940">Bilan VIH — Suivi standard (6 mois)</text>
  <text class="muted" x="170" y="985">NFS + biochimie + VL/CD4</text>

  <!-- Item 3 -->
  <rect class="pill" x="140" y="1040" width="540" height="130" rx="18"/>
  <text class="pillText" x="170" y="1100">Bilan VIH — Charge virale (3 mois)</text>
  <text class="muted" x="170" y="1145">Contrôle de l’efficacité</text>

  <!-- Item 4 -->
  <rect class="pill" x="140" y="1200" width="540" height="130" rx="18"/>
  <text class="pillText" x="170" y="1260">Bilan VIH — Immunité (CD4)</text>
  <text class="muted" x="170" y="1305">Suivi selon seuil 200/mm³</text>

  <!-- Item 5 -->
  <rect class="pill" x="140" y="1360" width="540" height="130" rx="18"/>
  <text class="pillText" x="170" y="1420">Bilan VIH — Résistance ARV</text>
  <text class="muted" x="170" y="1465">Génotypage (initial/échec)</text>

  <text class="muted" x="140" y="1560">Astuce: clic sur un pack →</text>
  <text class="muted" x="140" y="1605">ajout automatique des examens.</text>

  <!-- Center panel: Examens table -->
  <rect class="card" x="760" y="520" width="1080" height="2350" rx="22"/>
  <text class="h2" x="810" y="610">Examens prescrits</text>
  <text class="muted" x="810" y="660">Liste + fréquence recommandée + statut</text>

  <!-- Filters -->
  <rect class="btn2" x="810" y="705" width="130" height="60" rx="14"/>
  <text class="btnTextDark" x="845" y="748">Tous</text>
  <rect class="btn2" x="950" y="705" width="170" height="60" rx="14"/>
  <text class="btnTextDark" x="985" y="748">Biologie</text>
  <rect class="btn2" x="1130" y="705" width="160" height="60" rx="14"/>
  <text class="btnTextDark" x="1165" y="748">Imagerie</text>
  <rect class="btn2" x="1300" y="705" width="190" height="60" rx="14"/>
  <text class="btnTextDark" x="1335" y="748">Exploration</text>

  <!-- Table header -->
  <rect class="tableHead" x="810" y="790" width="980" height="80" rx="10"/>
  <text class="label" x="835" y="845">Catégorie</text>
  <text class="label" x="1030" y="845">Examen</text>
  <text class="label" x="1440" y="845">Fréquence</text>
  <text class="label" x="1690" y="845">Statut</text>

  <!-- Rows (grid) -->
  <g>
    <line class="grid" x1="810" y1="870" x2="1790" y2="870"/>
    <line class="grid" x1="810" y1="970" x2="1790" y2="970"/>
    <line class="grid" x1="810" y1="1070" x2="1790" y2="1070"/>
    <line class="grid" x1="810" y1="1170" x2="1790" y2="1170"/>
    <line class="grid" x1="810" y1="1270" x2="1790" y2="1270"/>
    <line class="grid" x1="810" y1="1370" x2="1790" y2="1370"/>

    <text class="text" x="835" y="935">VIH</text>
    <text class="text" x="1030" y="935">Charge virale VIH</text>
    <text class="muted" x="1440" y="935">Initial → 3m → 6m → annuel</text>
    <text class="text" x="1690" y="935">À prescrire</text>

    <text class="text" x="835" y="1035">Immunité</text>
    <text class="text" x="1030" y="1035">CD4</text>
    <text class="muted" x="1440" y="1035">&gt;200: 2 ans / ≤200: 3m</text>
    <text class="text" x="1690" y="1035">À prescrire</text>

    <text class="text" x="835" y="1135">Hémato</text>
    <text class="text" x="1030" y="1135">NFS + plaquettes</text>
    <text class="muted" x="1440" y="1135">Tous les 6 mois</text>
    <text class="text" x="1690" y="1135">À prescrire</text>

    <text class="text" x="835" y="1235">Biochimie</text>
    <text class="text" x="1030" y="1235">Créatinine + glycémie + foie</text>
    <text class="muted" x="1440" y="1235">Tous les 6 mois</text>
    <text class="text" x="1690" y="1235">À prescrire</text>

    <text class="text" x="835" y="1335">Sérologies</text>
    <text class="text" x="1030" y="1335">Hépatite B (Ag/Ac)</text>
    <text class="muted" x="1440" y="1335">Initial</text>
    <text class="text" x="1690" y="1335">À prescrire</text>
  </g>

  <!-- Bottom summary -->
  <rect class="card" x="760" y="2900" width="1080" height="210" rx="22"/>
  <text class="h2" x="810" y="2990">Résumé</text>
  <text class="muted" x="810" y="3045">Nb examens: 12 • À prescrire: 12 • Prescrits: 0 • Réalisés: 0</text>
  <text class="muted" x="810" y="3095">Dernière charge virale: —  • Dernier CD4: —</text>

  <!-- Right panel: Details -->
  <rect class="card" x="1870" y="520" width="520" height="2590" rx="22"/>
  <text class="h2" x="1920" y="610">Détails</text>
  <text class="muted" x="1920" y="660">Examen sélectionné</text>

  <rect class="tableHead" x="1920" y="720" width="420" height="60" rx="12"/>
  <text class="label" x="1940" y="762">Charge virale VIH</text>

  <text class="label" x="1920" y="850">Informations</text>
  <text class="muted" x="1920" y="905">Type: Biologie</text>
  <text class="muted" x="1920" y="955">Priorité: Haute</text>
  <text class="muted" x="1920" y="1005">Motif: Suivi</text>
  <text class="muted" x="1920" y="1055">Date prévue: __/__/____</text>

  <text class="label" x="1920" y="1160">Fréquence (remarque)</text>
  <text class="muted" x="1920" y="1215">Initial, à 3 mois, à 6 mois.</text>
  <text class="muted" x="1920" y="1260">Si indétectable: 1 fois/an.</text>

  <text class="label" x="1920" y="1370">Commentaire clinique</text>
  <rect class="card" x="1920" y="1410" width="420" height="220" rx="14"/>
  <text class="muted" x="1940" y="1480">Ex: Patient sous ARV,</text>
  <text class="muted" x="1940" y="1530">contrôle efficacité.</text>

  <text class="label" x="1920" y="1710">Rappels</text>
  <rect class="pill" x="1920" y="1750" width="420" height="90" rx="18"/>
  <text class="pillText" x="1940" y="1808">Prochain contrôle: +3 mois</text>

  <text class="muted" x="1920" y="1920">Intégration (option):</text>
  <text class="muted" x="1920" y="1970">→ Envoi LIS laboratoire</text>
  <text class="muted" x="1920" y="2020">→ Retour résultats auto</text>

</svg>