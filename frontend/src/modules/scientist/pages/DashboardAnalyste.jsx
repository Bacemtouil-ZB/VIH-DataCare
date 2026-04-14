import { useState, useEffect } from "react";

// ─── FAKE DATA ────────────────────────────────────────────────────────────────

const AGE_TRANCHES = ["<1", "1–4", "5–9", "10–14", "15–19", "20–24", "25–49", ">50"];

const kpi1Data = {
  hommes: [2, 5, 3, 4, 18, 42, 98, 31],
  femmes: [1, 4, 2, 3, 24, 51, 87, 19],
};

const kpi2Data = [
  { lieu: "Hôpital", count: 142 },
  { lieu: "CCDAG", count: 98 },
  { lieu: "Dépistage prénatal", count: 74 },
  { lieu: "ONG", count: 52 },
  { lieu: "Labo privé", count: 31 },
  { lieu: "Banque de sang", count: 18 },
  { lieu: "Autre", count: 12 },
  { lieu: "Non précisé", count: 9 },
];

const kpi3Data = {
  hommes: [1, 3, 2, 3, 8, 14, 42, 19],
  femmes: [0, 2, 1, 2, 6, 18, 38, 11],
};

const cd4ProfileData = {
  lt200: { h: [1,3,2,3,8,14,42,19], f: [0,2,1,2,6,18,38,11] },
  b200_350: { h: [1,2,1,2,6,18,31,14], f: [1,2,1,1,8,21,29,9] },
  gt350: { h: [0,0,0,0,4,10,25,4], f: [0,0,0,1,10,12,20,4] },
};

const fileActiveTotal = 373;
const fileActiveH = 261;
const fileActiveF = 112;
const fileActiveSparkline = [298, 312, 329, 347, 358, 373];

const cvCouverture = 0.79;
const suppressionPct = 0.71;
const indetectablePct = 0.54;

const cvDistrib = [
  { label: "<50 copies (indétectable)", value: 54, color: "#1D9E75" },
  { label: "50–999 copies", value: 17, color: "#9FE1CB" },
  { label: "≥1000 copies", value: 29, color: "#E24B4A" },
];

const deathData = {
  lt5: { h: 3, f: 2, fe: 0 },
  "5_14": { h: 2, f: 1, fe: 0 },
  gt15: { h: 18, f: 11, fe: 4 },
};

const pdvData = { lt5: 2, "5_14": 3, gt15: 41 };

const waterfallData = [
  { label: "File T−1", value: 347, type: "base" },
  { label: "+ Nouveaux", value: 43, type: "up" },
  { label: "− Décès", value: -9, type: "down" },
  { label: "− PDV", value: -5, type: "down" },
  { label: "− Transferts", value: -3, type: "down" },
  { label: "File T0", value: 373, type: "total" },
];

const populationsKeys = [
  { key: "PS", label: "Professionnel·les du sexe", count: 28, cible: 35, age25: 18, ageMoins: 10 },
  { key: "HSH", label: "HSH", count: 21, cible: 30, age25: 15, ageMoins: 6 },
  { key: "UDI", label: "Usagers drogues injectables", count: 12, cible: 15, age25: 9, ageMoins: 3 },
  { key: "Détenus", label: "Détenus", count: 9, cible: 12, age25: 8, ageMoins: 1 },
  { key: "Trans", label: "Personnes transgenres", count: 6, cible: 10, age25: 4, ageMoins: 2 },
  { key: "Discordants", label: "Couples séro-discordants", count: 17, cible: 20, age25: 15, ageMoins: 2 },
];

const protocolesData = [
  { label: "1ère ligne", h: 98, f: 71, color: "#1D9E75" },
  { label: "2ème ligne", h: 31, f: 22, color: "#EF9F27" },
  { label: "3ème ligne", h: 8, f: 6, color: "#E24B4A" },
  { label: "Autres", h: 4, f: 3, color: "#888780" },
];

const coinfections = [
  { label: "VIH/HVB", depiste: 89, coinfecte: 34, traite: 28, color: "#378ADD" },
  { label: "VIH/HVC", depiste: 76, coinfecte: 21, traite: 14, color: "#7F77DD" },
  { label: "VIH/TB", depiste: 94, coinfecte: 18, traite: 16, color: "#D85A30" },
  { label: "Migrants", depiste: 52, coinfecte: null, traite: null, color: "#888780" },
];

const TRIMESTRES = ["T1 2023", "T2 2023", "T3 2023", "T4 2023", "T1 2024", "T2 2024"];
const pdvTrend = [31, 38, 44, 41, 47, 46];
const cvTrend = [0.64, 0.68, 0.72, 0.76, 0.78, 0.79];

// ─── UTILS ────────────────────────────────────────────────────────────────────

const pct = (v, t) => ((v / t) * 100).toFixed(1) + "%";
const sum = (arr) => arr.reduce((a, b) => a + b, 0);

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function KpiCard({ value, label, sub, color = "#1D9E75", delta, small }) {
  return (
    <div style={{
      background: "var(--card)",
      border: "0.5px solid var(--border)",
      borderRadius: 14,
      padding: small ? "14px 18px" : "20px 24px",
      display: "flex", flexDirection: "column", gap: 4,
      borderLeft: `3px solid ${color}`,
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: "0.07em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: small ? 26 : 34, fontWeight: 700, color: "var(--text)", fontFamily: "'DM Mono', monospace", letterSpacing: "-1px" }}>{value}</span>
        {delta && <span style={{ fontSize: 12, color: delta > 0 ? "#1D9E75" : "#E24B4A", fontWeight: 600 }}>{delta > 0 ? "+" : ""}{delta}</span>}
      </div>
      {sub && <span style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</span>}
    </div>
  );
}

function SectionTitle({ children, num }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "32px 0 16px" }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: "var(--accent)", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 700, flexShrink: 0,
      }}>{num}</div>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>{children}</h2>
      <div style={{ flex: 1, height: "0.5px", background: "var(--border)" }} />
    </div>
  );
}

function GroupedBar({ data, labels, colors, height = 180 }) {
  const maxVal = Math.max(...data.flatMap(s => s.values));
  const barW = 14, gap = 4, groupGap = 14;
  const groupW = data.length * (barW + gap) - gap + groupGap;
  const svgW = labels.length * groupW + 40;

  return (
    <svg viewBox={`0 0 ${svgW} ${height + 30}`} style={{ width: "100%", overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = height - t * height;
        return (
          <g key={t}>
            <line x1={30} x2={svgW} y1={y} y2={y} stroke="var(--border)" strokeWidth={0.5} />
            <text x={26} y={y + 4} textAnchor="end" fontSize={9} fill="var(--muted)">{Math.round(t * maxVal)}</text>
          </g>
        );
      })}
      {labels.map((lbl, gi) => {
        const gx = 30 + gi * groupW;
        return (
          <g key={gi}>
            {data.map((serie, si) => {
              const bh = (serie.values[gi] / maxVal) * height;
              const bx = gx + si * (barW + gap);
              return (
                <g key={si}>
                  <rect x={bx} y={height - bh} width={barW} height={bh} rx={3} fill={colors[si]} opacity={0.9} />
                </g>
              );
            })}
            <text x={gx + (data.length * (barW + gap)) / 2 - gap} y={height + 14} textAnchor="middle" fontSize={9} fill="var(--muted)">{lbl}</text>
          </g>
        );
      })}
    </svg>
  );
}

function HorizontalBar({ items, colorFn }) {
  const maxVal = Math.max(...items.map(i => i.count));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, color: "var(--muted)", width: 140, flexShrink: 0, textAlign: "right" }}>{item.lieu}</span>
          <div style={{ flex: 1, background: "var(--border-bg)", borderRadius: 4, height: 16, overflow: "hidden" }}>
            <div style={{
              width: `${(item.count / maxVal) * 100}%`,
              height: "100%",
              background: colorFn ? colorFn(item.lieu) : "var(--accent)",
              borderRadius: 4,
              transition: "width 0.6s ease",
            }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", width: 34, textAlign: "right" }}>{item.count}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({ segments, size = 120, innerLabel }) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  const startAngles = [];
  let acc = -Math.PI / 2;
  for (let i = 0; i < segments.length; i++) {
    startAngles.push(acc);
    acc += (segments[i].value / segments.reduce((a, b) => a + b.value, 0)) * 2 * Math.PI;
  }
  const cx = size / 2, cy = size / 2, r = size * 0.38, ir = size * 0.25;

  const paths = segments.map((seg, i) => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const start = startAngles[i];
    const end = start + angle;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const lf = angle > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${lf} 1 ${x2} ${y2} Z`;
    return { path, color: seg.color, value: seg.value, label: seg.label };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {paths.map((p, i) => <path key={i} d={p.path} fill={p.color} opacity={0.9} />)}
      <circle cx={cx} cy={cy} r={ir} fill="var(--bg)" />
      {innerLabel && (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize={size * 0.13} fontWeight="700" fill="var(--text)">{innerLabel.val}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize={size * 0.085} fill="var(--muted)">{innerLabel.lbl}</text>
        </>
      )}
    </svg>
  );
}

function Gauge({ pct: val, target = 0.95, label, color }) {
  const angle = val * 180;
  const targetAngle = target * 180;
  const r = 52, cx = 70, cy = 70;
  const toRad = d => (d - 180) * Math.PI / 180;
  const arc = (deg) => {
    const x = cx + r * Math.cos(toRad(deg));
    const y = cy + r * Math.sin(toRad(deg));
    return [x, y];
  };
  // Removed unused x1, y1
  const [x2, y2] = arc(angle);
  const [tx, ty] = arc(targetAngle);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg viewBox="0 0 140 80" width={160}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--border-bg)" strokeWidth={10} strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
        <line x1={tx} y1={ty} x2={cx + (r - 16) * Math.cos(toRad(targetAngle))} y2={cy + (r - 16) * Math.sin(toRad(targetAngle))} stroke="#E24B4A" strokeWidth={2} strokeDasharray="3,2" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={18} fontWeight="700" fill="var(--text)" fontFamily="'DM Mono', monospace">{(val * 100).toFixed(0)}%</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="var(--muted)">cible {(target * 100).toFixed(0)}%</text>
      </svg>
      <span style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", maxWidth: 140 }}>{label}</span>
    </div>
  );
}

function StackedBar({ groups, labels, colors, legendItems, height = 160 }) {
  const totals = labels.map((_, i) => groups.reduce((s, g) => s + g.values[i], 0));
  const maxVal = Math.max(...totals);
  const barW = 24, gapW = 20;
  const svgW = labels.length * (barW + gapW) + 40;

  return (
    <div>
      <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
        {legendItems.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: colors[i] }} />
            <span style={{ fontSize: 11, color: "var(--muted)" }}>{l}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${svgW} ${height + 28}`} style={{ width: "100%", overflow: "visible" }}>
        {[0, 0.5, 1].map(t => {
          const y = height - t * height;
          return <line key={t} x1={30} x2={svgW} y1={y} y2={y} stroke="var(--border)" strokeWidth={0.5} />;
        })}
        {labels.map((lbl, gi) => {
          const gx = 32 + gi * (barW + gapW);
          let cumY = height;
          return (
            <g key={gi}>
              {groups.map((grp, si) => {
                const bh = (grp.values[gi] / maxVal) * height;
                cumY -= bh;
                return <rect key={si} x={gx} y={cumY} width={barW} height={bh} fill={colors[si]} opacity={0.9} rx={si === groups.length - 1 ? 3 : 0} />;
              })}
              <text x={gx + barW / 2} y={height + 14} textAnchor="middle" fontSize={9} fill="var(--muted)">{lbl}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LineChart({ data, labels, yMax, target, color, height = 120 }) {
  const svgW = 400;
  const padL = 36, padR = 12, padT = 10, padB = 24;
  const W = svgW - padL - padR, H = height - padT - padB;
  const xStep = W / (labels.length - 1);
  const pts = data.map((v, i) => [padL + i * xStep, padT + H - (v / yMax) * H]);
  const polyline = pts.map(p => p.join(",")).join(" ");
  const tY = padT + H - (target / yMax) * H;

  return (
    <svg viewBox={`0 0 ${svgW} ${height}`} style={{ width: "100%", overflow: "visible" }}>
      <line x1={padL} x2={svgW - padR} y1={tY} y2={tY} stroke="#E24B4A" strokeWidth={1} strokeDasharray="5,3" opacity={0.7} />
      <text x={svgW - padR + 3} y={tY + 4} fontSize={9} fill="#E24B4A">cible</text>
      {[0, 0.5, 1].map(t => {
        const y = padT + H - t * H;
        return (
          <g key={t}>
            <line x1={padL} x2={svgW - padR} y1={y} y2={y} stroke="var(--border)" strokeWidth={0.5} />
            <text x={padL - 4} y={y + 4} textAnchor="end" fontSize={9} fill="var(--muted)">{Math.round(t * yMax)}</text>
          </g>
        );
      })}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={color} />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={padL + i * xStep} y={height - 2} textAnchor="middle" fontSize={9} fill="var(--muted)">{l}</text>
      ))}
    </svg>
  );
}

function WaterfallChart({ data, height = 140 }) {
  const baseVal = data[0].value;
  const totalVal = data[data.length - 1].value;
  const maxVal = totalVal + 20;
  const barW = 36, gapW = 16;
  const svgW = data.length * (barW + gapW) + 50;

  // Precompute running totals to avoid mutation during render
  const runningTotals = [baseVal];
  for (let i = 1; i < data.length; i++) {
    if (data[i - 1].type === "base" || data[i - 1].type === "total") {
      runningTotals[i] = data[i - 1].value;
    } else {
      runningTotals[i] = runningTotals[i - 1] + data[i - 1].value;
    }
  }
  const bars = data.map((d, i) => {
    if (d.type === "base" || d.type === "total") {
      const bh = (d.value / maxVal) * height;
      return { x: 40 + i * (barW + gapW), y: height - bh, h: bh, color: d.type === "total" ? "#1D9E75" : "#378ADD", label: d.label, val: d.value };
    } else {
      const prev = runningTotals[i];
      const bh = Math.abs((d.value / maxVal) * height);
      const y = d.value > 0 ? height - (prev + d.value) / maxVal * height : height - prev / maxVal * height;
      return { x: 40 + i * (barW + gapW), y, h: bh, color: d.value > 0 ? "#1D9E75" : "#E24B4A", label: d.label, val: d.value };
    }
  });

  return (
    <svg viewBox={`0 0 ${svgW} ${height + 36}`} style={{ width: "100%", overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map(t => {
        const y = height - t * height;
        return <line key={t} x1={36} x2={svgW} y1={y} y2={y} stroke="var(--border)" strokeWidth={0.5} />;
      })}
      {bars.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={barW} height={b.h} rx={3} fill={b.color} opacity={0.88} />
          <text x={b.x + barW / 2} y={b.h < 14 ? b.y - 4 : b.y + 12} textAnchor="middle" fontSize={9} fontWeight="600" fill={b.h < 14 ? b.color : "#fff"}>{b.val > 0 ? "+" : ""}{b.val}</text>
          <text x={b.x + barW / 2} y={height + 14} textAnchor="middle" fontSize={8.5} fill="var(--muted)">{b.label.replace("+ ", "").replace("− ", "")}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("all");
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimIn(true), 50);
  }, []);

  const theme = {
    "--bg": darkMode ? "#0f1117" : "#f5f4f0",
    "--card": darkMode ? "#181c24" : "#ffffff",
    "--text": darkMode ? "#e8e6e0" : "#1a1915",
    "--muted": darkMode ? "#6b6e7a" : "#7a7972",
    "--border": darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
    "--border-bg": darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
    "--accent": "#1D9E75",
    "--accent2": "#378ADD",
  };

  // Removed unused variable 's'

  const totalNouveaux = sum(kpi1Data.hommes) + sum(kpi1Data.femmes);
  const totalTardifs = sum(kpi3Data.hommes) + sum(kpi3Data.femmes);
  const totalDeces = Object.values(deathData).reduce((a, d) => a + d.h + d.f + d.fe, 0);
  const totalPdv = Object.values(pdvData).reduce((a, b) => a + b, 0);

  return (
    <div style={{ ...theme, background: "var(--bg)", minHeight: "100vh", color: "var(--text)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "all 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* ── HEADER ── */}
      <header style={{
        borderBottom: "0.5px solid var(--border)",
        padding: "0 32px",
        height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--card)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" />
              <path d="M8 4v4l3 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.3px" }}>Dashboard VIH</div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: -1 }}>Programme national — Données T2 2024</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {["all", "section-i", "section-ii"].map(s => (
            <button key={s} onClick={() => setActiveSection(s)} style={{
              fontSize: 11, padding: "5px 12px", borderRadius: 6, border: "0.5px solid",
              borderColor: activeSection === s ? "#1D9E75" : "var(--border)",
              background: activeSection === s ? "#1D9E75" : "transparent",
              color: activeSection === s ? "#fff" : "var(--muted)",
              cursor: "pointer", fontWeight: 600, transition: "all 0.2s",
            }}>
              {s === "all" ? "Tout" : s === "section-i" ? "Section I" : "Section II"}
            </button>
          ))}
          <button onClick={() => setDarkMode(d => !d)} style={{
            width: 32, height: 32, borderRadius: 8, border: "0.5px solid var(--border)",
            background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)",
          }}>
            {darkMode ? "☀" : "☾"}
          </button>
        </div>
      </header>

      {/* ── HERO METRICS ── */}
      <div style={{ padding: "24px 32px 0", opacity: animIn ? 1 : 0, transform: animIn ? "none" : "translateY(12px)", transition: "all 0.5s ease" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 8 }}>
          <KpiCard value={fileActiveTotal} label="File active totale" sub={`H: ${fileActiveH} · F: ${fileActiveF}`} color="#1D9E75" delta={+15} />
          <KpiCard value={totalNouveaux} label="Nouveaux dépistés" sub="Période courante" color="#378ADD" />
          <KpiCard value={(suppressionPct * 100).toFixed(0) + "%"} label="Suppression virale" sub="CV < 1000 copies/ml" color="#7F77DD" />
          <KpiCard value={(indetectablePct * 100).toFixed(0) + "%"} label="Indétectables" sub="CV < 50 copies/ml" color="#5DCAA5" />
          <KpiCard value={totalDeces} label="Décès liés au sida" sub="Dont 4 femmes enceintes" color="#E24B4A" />
          <KpiCard value={totalPdv} label="Perdus de vue > 6 mois" sub={`${((totalPdv / fileActiveTotal) * 100).toFixed(1)}% de la file`} color="#EF9F27" />
        </div>
      </div>

      <div style={{ padding: "0 32px 40px", opacity: animIn ? 1 : 0, transition: "opacity 0.6s ease 0.1s" }}>

        {/* ════════════════════════ SECTION I ════════════════════════ */}
        {(activeSection === "all" || activeSection === "section-i") && (
          <>
            <div style={{
              margin: "28px 0 20px", padding: "8px 16px",
              background: "linear-gradient(90deg, rgba(29,158,117,0.12) 0%, transparent 100%)",
              borderLeft: "3px solid #1D9E75", borderRadius: "0 8px 8px 0",
              fontSize: 13, fontWeight: 700, color: "#1D9E75", letterSpacing: "0.03em",
            }}>
              SECTION I — NOUVEAUX MALADES
            </div>

            {/* KPI 1 – Nouveaux H/F par âge */}
            <SectionTitle num="1">Nouveaux PVVIH dépistés — H/F × 8 tranches d'âge</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                  {[["#378ADD", "Hommes"], ["#D4537E", "Femmes"]].map(([c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{l}</span>
                    </div>
                  ))}
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted)" }}>Total : {totalNouveaux} nouveaux</span>
                </div>
                <GroupedBar
                  data={[
                    { values: kpi1Data.hommes },
                    { values: kpi1Data.femmes },
                  ]}
                  labels={AGE_TRANCHES}
                  colors={["#378ADD", "#D4537E"]}
                  height={170}
                />
              </div>
              {/* Heatmap âge × genre */}
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 12 }}>Heatmap intensité — âge × genre</div>
                <div style={{ display: "grid", gridTemplateColumns: "70px repeat(8, 1fr)", gap: 3 }}>
                  <div />
                  {AGE_TRANCHES.map(t => (
                    <div key={t} style={{ fontSize: 9, color: "var(--muted)", textAlign: "center" }}>{t}</div>
                  ))}
                  {[["Hommes", kpi1Data.hommes, "#378ADD"], ["Femmes", kpi1Data.femmes, "#D4537E"]].map(([label, vals, col]) => {
                    const mx = Math.max(...vals);
                    return (
                      <>
                        <div style={{ fontSize: 10, color: "var(--muted)", display: "flex", alignItems: "center" }}>{label}</div>
                        {vals.map((v, i) => (
                          <div key={i} style={{
                            height: 32, borderRadius: 5,
                            background: col,
                            opacity: 0.15 + (v / mx) * 0.8,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 9, fontWeight: 600,
                            color: v / mx > 0.5 ? "#fff" : col,
                          }}>{v}</div>
                        ))}
                      </>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* KPI 2 – Lieu de dépistage */}
            <SectionTitle num="2">Lieu de dépistage des nouveaux</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <HorizontalBar
                  items={[...kpi2Data].sort((a, b) => b.count - a.count)}
                  colorFn={(lieu) => lieu === "Non précisé" ? "#888780" : "#1D9E75"}
                />
              </div>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <Donut
                  segments={kpi2Data.slice(0, 5).map((d, i) => ({
                    label: d.lieu, value: d.count,
                    color: ["#1D9E75", "#378ADD", "#7F77DD", "#D4537E", "#EF9F27"][i],
                  }))}
                  size={130}
                  innerLabel={{ val: sum(kpi2Data.map(d => d.count)), lbl: "total" }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
                  {kpi2Data.slice(0, 5).map((d, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: ["#1D9E75", "#378ADD", "#7F77DD", "#D4537E", "#EF9F27"][i] }} />
                        <span style={{ color: "var(--muted)" }}>{d.lieu}</span>
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{pct(d.count, sum(kpi2Data.map(x => x.count)))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI 3 & 4 – CD4 profil */}
            <SectionTitle num="3–4">Profil CD4 à l'entrée — diagnostic tardif et intermédiaire</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <div style={{ background: "#FCEBEB", color: "#A32D2D", fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
                    Taux tardif : {pct(totalTardifs, totalNouveaux)} ← indicateur OMS
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                  {[["#E24B4A", "CD4 <200 (tardif)"], ["#EF9F27", "CD4 200–350"], ["#1D9E75", "CD4 >350"]].map(([c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>{l}</span>
                    </div>
                  ))}
                </div>
                <StackedBar
                  groups={[
                    { values: AGE_TRANCHES.map((_, i) => cd4ProfileData.gt350.h[i] + cd4ProfileData.gt350.f[i]) },
                    { values: AGE_TRANCHES.map((_, i) => cd4ProfileData.b200_350.h[i] + cd4ProfileData.b200_350.f[i]) },
                    { values: AGE_TRANCHES.map((_, i) => cd4ProfileData.lt200.h[i] + cd4ProfileData.lt200.f[i]) },
                  ]}
                  labels={AGE_TRANCHES}
                  colors={["#1D9E75", "#EF9F27", "#E24B4A"]}
                  legendItems={[]}
                  height={150}
                />
              </div>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 14 }}>CD4 200 — comparaison H/F par tranche (tardifs)</div>
                <GroupedBar
                  data={[{ values: kpi3Data.hommes }, { values: kpi3Data.femmes }]}
                  labels={AGE_TRANCHES}
                  colors={["#E24B4A", "#F09595"]}
                  height={150}
                />
                <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                  {[["#E24B4A", "Hommes tardifs"], ["#F09595", "Femmes tardives"]].map(([c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI 5 – Protocoles ARV */}
            <SectionTitle num="5">Protocoles ARV des nouveaux — 1ère / 2ème / 3ème ligne</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10 }}>Distribution par ligne thérapeutique</div>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <Donut
                    segments={protocolesData.map(p => ({ label: p.label, value: p.h + p.f, color: p.color }))}
                    size={120}
                    innerLabel={{ val: sum(protocolesData.map(p => p.h + p.f)), lbl: "patients" }}
                  />
                  <div style={{ flex: 1 }}>
                    {protocolesData.map((p, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 2, background: p.color }} />
                          <span style={{ fontSize: 12, color: "var(--text)" }}>{p.label}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace", color: "var(--text)" }}>
                          {p.h + p.f} <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 400 }}>({pct(p.h + p.f, sum(protocolesData.map(x => x.h + x.f)))})</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10 }}>Comparaison H/F par ligne</div>
                <GroupedBar
                  data={[{ values: protocolesData.map(p => p.h) }, { values: protocolesData.map(p => p.f) }]}
                  labels={protocolesData.map(p => p.label.replace("ème", "e").replace("ère", "re"))}
                  colors={["#378ADD", "#D4537E"]}
                  height={150}
                />
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  {[["#378ADD", "Hommes"], ["#D4537E", "Femmes"]].map(([c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI 6 – Populations clés */}
            <SectionTitle num="6">Populations clés — avec benchmark OMS</SectionTitle>
            <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 24, height: 2, borderTop: "2px dashed #E24B4A" }} />
                <span>Ligne pointillée rouge = cible OMS par population</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {populationsKeys.map((p, i) => {
                  const maxW = Math.max(p.count, p.cible);
                  const targetPct = (p.cible / maxW) * 100;
                  const countPct = (p.count / maxW) * 100;
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 80px", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{p.label}</span>
                      <div style={{ position: "relative", height: 22 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "var(--border-bg)", borderRadius: 4 }} />
                        <div style={{
                          position: "absolute", top: 0, left: 0, bottom: 0,
                          width: `${countPct}%`,
                          background: p.count >= p.cible ? "#1D9E75" : "#378ADD",
                          borderRadius: 4, transition: "width 0.6s ease",
                          display: "flex", alignItems: "center", paddingLeft: 8,
                        }}>
                          <span style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>{p.count}</span>
                        </div>
                        <div style={{
                          position: "absolute", top: -3, bottom: -3,
                          left: `${targetPct}%`, width: 2,
                          background: "#E24B4A", borderRadius: 1,
                        }} />
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)", textAlign: "right" }}>
                        cible : <strong style={{ color: "var(--text)" }}>{p.cible}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KPI 7 – Co-infections */}
            <SectionTitle num="7">Co-infections VIH/HVB · VIH/HVC · VIH/TB + Migrants</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {coinfections.map((ci, i) => (
                <div key={i} style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderLeft: `3px solid ${ci.color}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ci.color, marginBottom: 12 }}>{ci.label}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>Dépistés</div>
                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{ci.depiste}</div>
                    </div>
                    {ci.coinfecte !== null && (
                      <>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--muted)" }}>Co-infectés</div>
                          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: ci.color }}>{ci.coinfecte}</div>
                          <div style={{ fontSize: 10, color: "var(--muted)" }}>{pct(ci.coinfecte, ci.depiste)} des dépistés</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "var(--muted)" }}>Traités</div>
                          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#1D9E75" }}>{ci.traite}</div>
                          <div style={{ height: 4, background: "var(--border-bg)", borderRadius: 2, marginTop: 4 }}>
                            <div style={{ width: `${(ci.traite / ci.coinfecte) * 100}%`, height: "100%", background: "#1D9E75", borderRadius: 2 }} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ════════════════════════ SECTION II ════════════════════════ */}
        {(activeSection === "all" || activeSection === "section-ii") && (
          <>
            <div style={{
              margin: "28px 0 20px", padding: "8px 16px",
              background: "linear-gradient(90deg, rgba(55,138,221,0.12) 0%, transparent 100%)",
              borderLeft: "3px solid #378ADD", borderRadius: "0 8px 8px 0",
              fontSize: 13, fontWeight: 700, color: "#378ADD", letterSpacing: "0.03em",
            }}>
              SECTION II — TOUTE LA FILE ACTIVE
            </div>

            {/* KPI 8 – CV de contrôle */}
            <SectionTitle num="8">CV de contrôle — réalisée  6 mois après début ARV</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10 }}>Évolution trimestrielle du taux de CV réalisée</div>
                <LineChart data={cvTrend} labels={TRIMESTRES} yMax={1} target={0.90} color="#378ADD" height={130} />
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 6 }}>Ligne rouge = cible OMS 90%</div>
              </div>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>Couverture CV actuelle</div>
                <div style={{ fontSize: 40, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#378ADD" }}>{(cvCouverture * 100).toFixed(0)}%</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>sur {fileActiveTotal} patients suivis</div>
                <div style={{ height: 8, background: "var(--border-bg)", borderRadius: 4, marginTop: 14, position: "relative" }}>
                  <div style={{ width: `${cvCouverture * 100}%`, height: "100%", background: "#378ADD", borderRadius: 4 }} />
                  <div style={{ position: "absolute", top: -3, bottom: -3, left: "90%", width: 2, background: "#E24B4A", borderRadius: 1 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
                  <span>0%</span><span style={{ color: "#E24B4A" }}>cible 90%</span><span>100%</span>
                </div>
              </div>
            </div>

            {/* KPI 9 & 10 – Suppression virale */}
            <SectionTitle num="9–10">Cascade virale — suppression et indétectabilité (95-95-95)</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", gap: 32 }}>
                  <Gauge pct={suppressionPct} target={0.95} label="CV < 1000 copies/ml (3ème 95)" color="#7F77DD" />
                  <Gauge pct={indetectablePct} target={0.95} label="CV < 50 copies/ml (indétectable)" color="#1D9E75" />
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
                  Indétectable = Intransmissible (U=U) — principe OMS
                </div>
              </div>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10 }}>Distribution complète des charges virales</div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <Donut segments={cvDistrib} size={130} innerLabel={{ val: fileActiveTotal, lbl: "patients" }} />
                  <div style={{ flex: 1 }}>
                    {cvDistrib.map((seg, i) => (
                      <div key={i} style={{ padding: "8px 0", borderBottom: "0.5px solid var(--border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 2, background: seg.color }} />
                            <span style={{ fontSize: 11, color: "var(--text)" }}>{seg.label}</span>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: seg.color }}>{seg.value}%</span>
                        </div>
                        <div style={{ height: 3, background: "var(--border-bg)", borderRadius: 2, marginTop: 6 }}>
                          <div style={{ width: `${seg.value}%`, height: "100%", background: seg.color, borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* KPI 11 & 12 – Décès et PDV */}
            <SectionTitle num="11–12">Décès liés au sida · Perdus de vue  6 mois</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderLeft: "3px solid #E24B4A", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                  {[
                    [totalDeces, "Décès total", "#E24B4A"],
                    [4, "Femmes enceintes", "#D4537E"],
                  ].map(([v, l, c]) => (
                    <div key={l} style={{ background: "rgba(226,75,74,0.08)", borderRadius: 8, padding: "8px 14px" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: c }}>{v}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[["< 5 ans", deathData.lt5], ["5–14 ans", deathData["5_14"]], ["> 15 ans", deathData.gt15]].map(([label, d]) => (
                    <div key={label} style={{ display: "grid", gridTemplateColumns: "60px 1fr 1fr 1fr", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>{label}</span>
                      {[["H", d.h, "#E24B4A"], ["F", d.f, "#F09595"], ["FE", d.fe, "#D4537E"]].map(([k, v, c]) => (
                        <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 10, color: "var(--muted)" }}>{k}:</span>
                          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: c }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 10 }}>FE = femmes enceintes — sous-groupe prioritaire OMS · Tranches : &lt;5 / 5–14 / &gt;15 ans</div>
              </div>

              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderLeft: "3px solid #EF9F27", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                  <div style={{ background: "rgba(239,159,39,0.1)", borderRadius: 8, padding: "8px 14px" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#EF9F27" }}>{totalPdv}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>PDV total</div>
                  </div>
                  <div style={{
                    background: totalPdv / fileActiveTotal > 0.1 ? "rgba(226,75,74,0.1)" : "rgba(29,158,117,0.1)",
                    borderRadius: 8, padding: "8px 14px",
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: totalPdv / fileActiveTotal > 0.1 ? "#E24B4A" : "#1D9E75" }}>
                      {((totalPdv / fileActiveTotal) * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>de la file active</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#E24B4A", marginBottom: 10, fontWeight: 600 }}>
                  {totalPdv / fileActiveTotal > 0.1 ? "⚠ Seuil OMS 10% dépassé" : "✓ Sous le seuil OMS 10%"}
                </div>
                <LineChart data={pdvTrend} labels={TRIMESTRES} yMax={60} target={fileActiveTotal * 0.1} color="#EF9F27" height={120} />
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>Ligne rouge = seuil OMS 10% de la file active</div>
              </div>
            </div>

            {/* KPI 13 – Transferts */}
            <SectionTitle num="13">Transferts</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              <KpiCard value={3} label="Transferts < 5 ans" color="#888780" small />
              <KpiCard value={5} label="Transferts 5–14 ans" color="#888780" small />
              <KpiCard value={14} label="Transferts > 15 ans" color="#888780" small />
              <KpiCard value={22} label="Total transferts" sub="WHERE statut = 'Transferté'" color="#5F5E5A" small />
            </div>
            <div style={{ background: "rgba(239,159,39,0.08)", border: "0.5px solid rgba(239,159,39,0.3)", borderRadius: 10, padding: "10px 16px", fontSize: 11, color: "#854F0B", marginTop: 8 }}>
              Note technique : requête filtrée sur <code style={{ fontFamily: "'DM Mono', monospace", fontSize: 10 }}>statut_patient = 'Transferté'</code> — orthographe avec accent à respecter en base de données.
            </div>

            {/* KPI 14 – Récupération PDV */}
            <SectionTitle num="14">Récupération des perdus de vue</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <KpiCard value="18" label="PDV récupérés" sub="Période courante" color="#1D9E75" small />
              <KpiCard value="39%" label="Taux de réintégration" sub="Récupérés / PDV total" color="#5DCAA5" small />
              <KpiCard value="28" label="PDV actifs non récupérés" sub="Encore en attente relance" color="#EF9F27" small />
            </div>

            {/* KPI 15 & 16 – File active totale + ARV */}
            <SectionTitle num="15–16">File active totale · Patients sous ARV actifs</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderLeft: "3px solid #1D9E75", borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>KPI central — File active</div>
                <div style={{ fontSize: 56, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#1D9E75", lineHeight: 1 }}>373</div>
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Hommes : <strong style={{ color: "var(--text)" }}>261</strong></span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Femmes : <strong style={{ color: "var(--text)" }}>112</strong></span>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Sparkline 6 trimestres</div>
                  <svg viewBox={`0 0 240 50`} style={{ width: "100%" }}>
                    {fileActiveSparkline.map((v, i) => {
                      const x = (i / (fileActiveSparkline.length - 1)) * 220 + 10;
                      const y = 45 - ((v - 280) / 100) * 40;
                      return i === 0 ? null : (
                        <line key={i}
                          x1={(((i - 1) / (fileActiveSparkline.length - 1)) * 220 + 10)}
                          y1={45 - ((fileActiveSparkline[i - 1] - 280) / 100) * 40}
                          x2={x} y2={y}
                          stroke="#1D9E75" strokeWidth={2}
                        />
                      );
                    })}
                    {fileActiveSparkline.map((v, i) => {
                      const x = (i / (fileActiveSparkline.length - 1)) * 220 + 10;
                      const y = 45 - ((v - 280) / 100) * 40;
                      return <circle key={i} cx={x} cy={y} r={i === fileActiveSparkline.length - 1 ? 4 : 2.5} fill="#1D9E75" />;
                    })}
                    {fileActiveSparkline.map((v, i) => {
                      const x = (i / (fileActiveSparkline.length - 1)) * 220 + 10;
                      return <text key={i} x={x} y={50} textAnchor="middle" fontSize={8} fill="var(--muted)">{TRIMESTRES[i]}</text>;
                    })}
                  </svg>
                </div>
              </div>

              <div style={{ background: "var(--card)", border: "0.5px solid var(--border)", borderLeft: "3px solid #378ADD", borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Flux Waterfall — variation nette ARV</div>
                <WaterfallChart data={waterfallData} height={130} />
                <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
                  {[["#1D9E75", "Entrées / Total"], ["#E24B4A", "Sorties"], ["#378ADD", "Base"]].map(([c, l]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>{l}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--border-bg)", borderRadius: 8, fontSize: 11, color: "var(--muted)" }}>
                  Exclusions appliquées : décédés · émigrés · PDV · arrêt traitement
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: "0.5px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)" }}>
          <span>Dashboard VIH — Données fictives à titre illustratif · Cascade OMS 95-95-95</span>
          <span>T2 2024 · 16 KPIs · Sections I & II</span>
        </div>
      </div>
    </div>
  );
}