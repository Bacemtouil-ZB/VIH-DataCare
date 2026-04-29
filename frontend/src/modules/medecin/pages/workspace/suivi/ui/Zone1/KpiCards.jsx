// ============================================================
//  KpiCards.jsx — VERSION FINALE CORRIGÉE
// ============================================================

import { Spin, Empty } from "antd";
import {
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  CalendarOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

import {
  formatCD4,
  formatCV,
  formatCreatinine,
  formatDate,
  getCD4HexColor,
  getCreatinineAntColor,
  getCVAntColor,
  getHBVHexColor,
} from "../../helpers/suiviHelpers";

import {
  COULEURS_STATUT_HEX,
  STATUTS,
  UNITES,
  MESSAGES_VIDES,
} from "../../constants/suiviConstants";

// ============================================================
//  Tendance
// ============================================================
const Tendance = ({ actuel, precedent, inverse = false }) => {
  if (actuel == null || precedent == null) return null;
  if (actuel === precedent)
    return <MinusOutlined style={{ fontSize: 10, color: "#aaa" }} />;

  const hausse = actuel > precedent;
  const positif = inverse ? !hausse : hausse;

  return positif
    ? <RiseOutlined style={{ fontSize: 10, color: COULEURS_STATUT_HEX[STATUTS.BON] }} />
    : <FallOutlined style={{ fontSize: 10, color: COULEURS_STATUT_HEX[STATUTS.CRITIQUE] }} />;
};


// ============================================================
//  KpiCard MINI CLEAN 
// ============================================================
// ============================================================
//  KpiCard RESPONSIVE
// ============================================================
const KpiCard = ({ icon, iconBg, label, value, unite, pourcent, rows }) => (
  <div style={{
    width: "100%",              // ✔ responsive
    height: 110,
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    padding: "8px 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  }}>

    {/* HEADER */}
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {icon}
      </div>

      <span style={{
        fontSize: 10,
        fontWeight: 600,
        color: "#6B7280",
      }}>
        {label}
      </span>
    </div>

    {/* VALUE */}
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#111827",
        }}>
          {value}
        </span>

        {unite && (
          <span style={{ fontSize: 9, color: "#9CA3AF" }}>
            {unite}
          </span>
        )}

        {pourcent != null && (
          <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#111827",
              background: "#3B82F615", // bleu avec transparence
              border: "1px solid #3B82F640",
              borderRadius: 6,
              padding: "2px 6px",
              marginLeft: 4,
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}>
               {pourcent} %
          </span>
        )}
      </div>
    </div>

    {/* INFOS */}
    <div style={{
      borderTop: "1px solid #F3F4F6",
      paddingTop: 4,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}>
      {rows.map((row, i) =>
        row ? (
          <div key={i} style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 9,
          }}>
            <span style={{ color: "#9CA3AF" }}>
              {row.icon} {row.label}
            </span>

            <span style={{ color: "#374151", fontWeight: 500 }}>
              {row.extra}{row.value}
            </span>
          </div>
        ) : null
      )}
    </div>
  </div>
);
// ============================================================
//  MAIN COMPONENT
// ============================================================
const KpiCards = ({ kpis, loading }) => {

  if (loading) {
    return <div style={{ textAlign: "center", padding: 30 }}><Spin /></div>;
  }

  if (!kpis) {
    return <Empty description={MESSAGES_VIDES.kpis} />;
  }

  const cd4Color = getCD4HexColor(kpis.cd4?.valeur);

  const cvKey = getCVAntColor(kpis.cv?.valeur);
  const cvColor =
    cvKey === "success" ? COULEURS_STATUT_HEX[STATUTS.BON] :
    cvKey === "warning" ? COULEURS_STATUT_HEX[STATUTS.MOYEN] :
    cvKey === "error"   ? COULEURS_STATUT_HEX[STATUTS.CRITIQUE] :
    COULEURS_STATUT_HEX[STATUTS.INCONNU];

  const creatKey = getCreatinineAntColor(kpis.creatinine?.valeur);
  const creatColor =
    creatKey === "success" ? COULEURS_STATUT_HEX[STATUTS.BON] :
    creatKey === "warning" ? COULEURS_STATUT_HEX[STATUTS.MOYEN] :
    creatKey === "error"   ? COULEURS_STATUT_HEX[STATUTS.CRITIQUE] :
    COULEURS_STATUT_HEX[STATUTS.INCONNU];

  const hbv = kpis.serologie_hbv;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        paddingBottom: 4,
      }}>

        {/* CD4 */}
        <KpiCard
          icon={<HeartOutlined style={{ color: "#2563EB" }} />}
          iconBg="#DBEAFE"
          label="CD4"
          value={formatCD4(kpis.cd4?.valeur)}
          valueColor={cd4Color}
          unite={UNITES.CD4}
          pourcent={kpis.cd4?.pourcent}
          rows={[
            kpis.cd4?.date && {
              icon: <CalendarOutlined />,
              label: "Mesure",
              value: formatDate(kpis.cd4.date),
            },
            kpis.cd4?.precedent && {
              icon: <LineChartOutlined />,
              label: "Préc.",
              value: formatCD4(kpis.cd4.precedent),
              extra: <Tendance actuel={kpis.cd4.valeur} precedent={kpis.cd4.precedent} />,
            }
          ]}
        />

        {/* CV */}
        <KpiCard
          icon={<ThunderboltOutlined style={{ color: "#DC2626" }} />}
          iconBg="#FEE2E2"
          label="Charge virale"
          value={formatCV(kpis.cv?.valeur)}
          valueColor={cvColor}
          unite={kpis.cv?.valeur >= 200 ? UNITES.CV : ""}
          rows={[
            kpis.cv?.date && {
              icon: <CalendarOutlined />,
              label: "Mesure",
              value: formatDate(kpis.cv.date),
            },
            kpis.cv?.precedent && {
              icon: <LineChartOutlined />,
              label: "Préc.",
              value: formatCV(kpis.cv.precedent),
              extra: <Tendance actuel={kpis.cv.valeur} precedent={kpis.cv.precedent} inverse />,
            }
          ]}
        />

        {/* Créatinine */}
        <KpiCard
          icon={<ExperimentOutlined style={{ color: "#059669" }} />}
          iconBg="#D1FAE5"
          label="Créatinine"
          value={formatCreatinine(kpis.creatinine?.valeur)}
          valueColor={creatColor}
          unite={UNITES.CREATININE}
          rows={[
            kpis.creatinine?.date && {
              icon: <CalendarOutlined />,
              label: "Mesure",
              value: formatDate(kpis.creatinine.date),
            }
          ]}
        />

        {/* HBV (SIMPLIFIÉ) */}
        {hbv && (
          <>
            <KpiCard
              icon={<MedicineBoxOutlined style={{ color: "#DC2626" }} />}
              iconBg="#FEE2E2"
              label="AgHBs"
              value={hbv.ag_hbs ?? "—"}
              valueColor={getHBVHexColor("ag_hbs", hbv.ag_hbs)}
              rows={[
                hbv.date && {
                  icon: <CalendarOutlined />,
                  label: "Mesure",
                  value: formatDate(hbv.date),
                }
              ]}
            />

            <KpiCard
              icon={<MedicineBoxOutlined style={{ color: "#059669" }} />}
              iconBg="#D1FAE5"
              label="Anti-HBs"
              value={hbv.anti_hbs ?? "—"}
              valueColor={getHBVHexColor("anti_hbs", hbv.anti_hbs)}
              rows={[
                hbv.date && {
                  icon: <CalendarOutlined />,
                  label: "Mesure",
                  value: formatDate(hbv.date),
                }
              ]}
            />

            <KpiCard
              icon={<MedicineBoxOutlined style={{ color: "#D97706" }} />}
              iconBg="#FEF3C7"
              label="Anti-HBc"
              value={hbv.anti_hbc ?? "—"}
              valueColor={getHBVHexColor("anti_hbc", hbv.anti_hbc)}
              rows={[
                hbv.date && {
                  icon: <CalendarOutlined />,
                  label: "Mesure",
                  value: formatDate(hbv.date),
                }
              ]}
            />
          </>
        )}

      </div>
    </div>
  );
};

export default KpiCards;