
/// style amélioré : courbe de Bézier cubique pour une transition plus fluide entre les segments, surtout visible sur les CV avec échelles log
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

        const c1 = getCouleur(v1);
        const c2 = getCouleur(v2);
        const couleur = c1 === c2 ? c1 : c2;

        //  Courbe de Bézier cubique — points de contrôle au 1/3 et 2/3 horizontalement
        const cx1 = p1.x + (p2.x - p1.x) / 3;
        const cx2 = p1.x + (2 * (p2.x - p1.x)) / 3;

        return (
          <path
            key={`seg-${i}`}
            d={`M ${p1.x} ${p1.y} C ${cx1} ${p1.y}, ${cx2} ${p2.y}, ${p2.x} ${p2.y}`}
            stroke={couleur}
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
          />
        );
      })}
    </g>
  );
};


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