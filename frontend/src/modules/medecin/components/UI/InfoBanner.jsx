const VARIANT_CONFIG = {
  success: {
    alertClassName: "alert-success",
    accentColor: "#198754",
  },
  info: {
    alertClassName: "alert-info",
    accentColor: "#0dcaf0",
  },
  warning: {
    alertClassName: "alert-warning",
    accentColor: "#ffc107",
  },
  danger: {
    alertClassName: "alert-danger",
    accentColor: "#dc3545",
  },
};

export default function InfoBanner({
  children,
  variant = "success",
  iconClassName = "",
  className = "",
}) {
  if (!children) return null;

  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG.success;
  const classes = [
    "alert",
    config.alertClassName,
    "d-flex",
    "align-items-center",
    "flex-wrap",
    "gap-2",
    "mb-3",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      role="status"
      style={{
        borderLeft: `4px solid ${config.accentColor}`,
      }}
    >
      {iconClassName ? <i className={iconClassName} aria-hidden="true" /> : null}
      {children}
    </div>
  );
}
