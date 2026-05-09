import {
  ExclamationCircleFilled,
  WarningFilled,
} from "@ant-design/icons";

export const ALERT_STYLE_BY_TYPE = {
  danger: {
    background: "#FFF1F0",
    border: "#FFA39E",
    accent: "#E24B4A",
    text: "#5C1D1D",
    label: "#A32D2D",
    badge: "Critique",
    Icon: ExclamationCircleFilled,
  },
  warning: {
    background: "#FFFBE6",
    border: "#FFE58F",
    accent: "#BA7517",
    text: "#5A4700",
    label: "#854F0B",
    badge: "Attention",
    Icon: WarningFilled,
  },
};

export const getAlertStyle = (type) =>
  ALERT_STYLE_BY_TYPE[type] || ALERT_STYLE_BY_TYPE.warning;

export const getVisibleAlertes = (alertes = [], dismissed = []) =>
  [...alertes]
    .map((alerte, index) => ({ ...alerte, _index: index }))
    .filter((alerte) => !dismissed.includes(alerte._index))
    .sort((left, right) => {
      if (left.type === right.type) return 0;
      return left.type === "danger" ? -1 : 1;
    });
