import { CloseOutlined } from "@ant-design/icons";
import { getAlertStyle } from "./alertesBannerHelpers";
import { useAlertesBanner } from "./useAlertesBanner";

const AlerteItem = ({ alerte, onDismiss }) => {
  const style = getAlertStyle(alerte.type);
  const { Icon } = style;

  return (
    <div
      className="alertes-banner-item"
      style={{
        background: style.background,
        borderColor: style.border,
        borderLeftColor: style.accent,
      }}
    >
      <Icon
        className="alertes-banner-icon"
        style={{ color: style.accent }}
      />

      <div className="alertes-banner-content">
        <span
          className="alertes-banner-badge"
          style={{ color: style.label }}
        >
          {style.badge} -
        </span>

        <span
          className="alertes-banner-message"
          style={{ color: style.text }}
        >
          {alerte.message}
        </span>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="alertes-banner-close"
        style={{ color: style.accent }}
      >
        <CloseOutlined className="alertes-banner-close-icon" />
      </button>
    </div>
  );
};

const AlertesBanner = ({ alertes = [] }) => {
  const { visibleAlertes, dismissAlerte } = useAlertesBanner(alertes);

  if (!visibleAlertes.length) return null;

  return (
    <div className="alertes-banner">
      {visibleAlertes.map((alerte) => (
        <AlerteItem
          key={alerte._index}
          alerte={alerte}
          onDismiss={() => dismissAlerte(alerte._index)}
        />
      ))}
    </div>
  );
};

export default AlertesBanner;
