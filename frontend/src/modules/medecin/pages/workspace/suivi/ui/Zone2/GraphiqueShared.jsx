// ============================================================
//  GraphiqueShared.jsx — Composants partagés Zone2
//  Utilisé par : GraphiqueCD4.jsx, GraphiqueCV.jsx
// ============================================================

// ── LigneMulticolore ─────────────────────────────────────────
// Dessine les segments de la courbe en coloriant chaque segment
// selon la couleur des deux points qu'il relie (logique : si l'un
// des deux points est critique, le segment prend la couleur critique)
// Props :
//   points      — tableau de {x, y} fourni par Recharts
//   data        — tableau de données brutes (même index que points)
//   getCouleur  — (valeur) => couleur hex
//   dataKey     — clé de la valeur dans data (ex: "cd4_absolu")

export const LigneMulticolore = ({ points, data, getCouleur, dataKey }) => {
  if (!points || points.length < 2) return null;

  return (
    <g>
      {points.slice(0, -1).map((p1, i) => {
        const p2 = points[i + 1];
        if (!p1 || !p2 || p1.x == null || p2.x == null) return null;

        const v1 = data[i]?.[dataKey];
        const v2 = data[i + 1]?.[dataKey];
        if (v1 == null || v2 == null) return null;

        // Le segment prend la couleur la plus "grave" des deux extrémités
        // On délègue entièrement à getCouleur — pas de logique seuil ici
        const c1 = getCouleur(v1);
        const c2 = getCouleur(v2);
        // Si les deux couleurs diffèrent, on prend celle du point le plus critique
        // Convention : getCouleur retourne une couleur, on prend c2 (point d'arrivée)
        // pour indiquer la tendance
        const couleur = c1 === c2 ? c1 : c2;

        return (
          <line
            key={`seg-${i}`}
            x1={p1.x} y1={p1.y}
            x2={p2.x} y2={p2.y}
            stroke={couleur}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

// ── DotColore ────────────────────────────────────────────────
// Dot affiché sur chaque point de la courbe, colorié dynamiquement
// Props :
//   cx, cy     — coordonnées fournies par Recharts
//   payload    — données du point
//   dataKey    — clé de la valeur dans payload
//   getCouleur — (valeur) => couleur hex
//   fondSombre — couleur de fond du graphique (défaut : "#0F172A")

export const DotColore = (props) => {
  const {
    cx, cy, payload,
    dataKey,
    getCouleur,
    fondSombre = "#0F172A",
  } = props;

  if (!cx || !cy) return null;

  const valeur  = payload?.[dataKey];
  const couleur = getCouleur(valeur);

  return (
    <circle
      key={`dot-${payload?.date}`}
      cx={cx}
      cy={cy}
      r={4.5}
      fill={fondSombre}
      stroke={couleur}
      strokeWidth={2.5}
    />
  );
};

// ── LabelValeurAlternee ───────────────────────────────────────
// Affiche la valeur au-dessus ou en-dessous du point en alternant
// pour éviter les chevauchements
// Props :
//   x, y       — coordonnées fournies par Recharts via LabelList
//   value      — valeur brute du dataKey (peut être log pour CV)
//   index      — index du point (pour l'alternance)
//   getCouleur — (valeurReelle) => couleur hex
//   formater   — (valeurReelle) => string affichée
//   data       — tableau brut pour récupérer la valeur réelle (utile si dataKey est transformé ex: valeurLog)
//   dataKeyReel— clé de la valeur réelle dans data (ex: "cd4_absolu", "charge_virale_valeur")

export const LabelValeurAlternee = ({
  x, y,
  value,
  index,
  getCouleur,
  formater,
  data,
  dataKeyReel,
}) => {
  // Si data + dataKeyReel fournis, on utilise la valeur réelle (pas log)
  const valeurReelle = data && dataKeyReel
    ? data[index]?.[dataKeyReel]
    : value;

  if (valeurReelle == null) return null;

  const couleur  = getCouleur(valeurReelle);
  const affiche  = formater(valeurReelle);
  const decalage = index % 2 === 0 ? -14 : 18;

  return (
    <text
      x={x}
      y={y + decalage}
      textAnchor="middle"
      fontSize={10}
      fontWeight={700}
      fill={couleur}
    >
      {affiche}
    </text>
  );
};