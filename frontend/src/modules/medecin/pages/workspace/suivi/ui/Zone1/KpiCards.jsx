import { Empty, Spin } from "antd";
import {
  CalendarOutlined,
  ExperimentOutlined,
  FallOutlined,
  HeartOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
  MinusOutlined,
  RiseOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  buildKpiCardsData,
  getEmptyKpisMessage,
} from "./kpiCardsHelpers";

const ICON_BY_KEY = {
  heart: HeartOutlined,
  thunderbolt: ThunderboltOutlined,
  experiment: ExperimentOutlined,
  medicine: MedicineBoxOutlined,
};

const RowIcon = ({ kind }) => {
  if (kind === "calendar") return <CalendarOutlined />;
  if (kind === "trend") return <LineChartOutlined />;
  return null;
};

const TrendIcon = ({ trend }) => {
  if (!trend) return null;
  if (trend.direction === "flat") {
    return <MinusOutlined className="kpi-trend-icon kpi-trend-flat" />;
  }

  const className = trend.positive
    ? "kpi-trend-icon kpi-trend-positive"
    : "kpi-trend-icon kpi-trend-negative";

  return trend.direction === "up" ? (
    <RiseOutlined className={className} />
  ) : (
    <FallOutlined className={className} />
  );
};

const KpiCard = ({ card }) => {
  const Icon = ICON_BY_KEY[card.icon];

  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <div className="kpi-card-icon-box">
          {Icon ? <Icon className="kpi-card-icon" /> : null}
        </div>
        <span className="kpi-card-label">{card.label}</span>
      </div>

      <div className="kpi-card-value-row">
        <span
          className="kpi-card-value"
          style={{ color: card.valueColor || "#111827" }}
        >
          {card.value}
        </span>

        {card.unit ? <span className="kpi-card-unit">{card.unit}</span> : null}

        {card.percent != null ? (
          <span className="kpi-card-percent">{card.percent} %</span>
        ) : null}
      </div>

      <div className="kpi-card-footer">
        {card.rows.map((row, index) => (
          <div key={`${card.key}-${index}`} className="kpi-card-row">
            <span className="kpi-card-row-label">
              <RowIcon kind={row.kind} /> {row.label}
            </span>
            <span className="kpi-card-row-value">
              <TrendIcon trend={row.trend} />
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const KpiCards = ({ kpis, loading }) => {
  if (loading) {
    return (
      <div className="kpi-cards-loading">
        <Spin />
      </div>
    );
  }

  if (!kpis) {
    return <Empty description={getEmptyKpisMessage()} />;
  }

  const cards = buildKpiCardsData(kpis);

  return (
    <div className="kpi-cards">
      <div className="kpi-cards-scroller">
        {cards.map((card) => (
          <KpiCard key={card.key} card={card} />
        ))}
      </div>
    </div>
  );
};

export default KpiCards;
