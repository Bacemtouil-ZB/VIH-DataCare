import Swal from "sweetalert2";

/* === Injection CSS locale === */
const injectAlertStyles = () => {
  if (document.getElementById("app-alert-styles")) return;

  const style = document.createElement("style");
  style.id = "app-alert-styles";

  style.innerHTML = `
    .app-alert-compact {
      padding: 1.2rem !important;
      max-width: 400px !important;
      border-radius: 12px;
    }

    .app-alert-title {
      font-size: 1.05rem !important;
      font-weight: 600;
      margin-bottom: 0.4rem;
    }

    .app-alert-text {
      font-size: 0.9rem !important;
      color: #6c757d;
    }

    .app-alert-actions {
      display: flex !important;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.2rem;
    }

    .app-alert-btn {
      padding: 0.4rem 1rem !important;
      font-size: 0.85rem;
      border-radius: 8px;
      min-width: 90px;
      transition: all 0.2s ease;
    }

    .app-alert-btn:hover {
      transform: translateY(-1px);
    }

    .swal2-icon {
      transform: scale(0.85);
    }
  `;

  document.head.appendChild(style);
};

injectAlertStyles();

/* === Instance Professionnelle Compacte === */

export const Alert = Swal.mixin({
  customClass: {
    popup: "app-alert-compact rounded-3 shadow border-0",
    title: "app-alert-title",
    htmlContainer: "app-alert-text",
    actions: "app-alert-actions",
    confirmButton: "btn btn-app-primary app-alert-btn",
    cancelButton: "btn btn-app-outline app-alert-btn",
  },

  width: 400,

  buttonsStyling: false,
  reverseButtons: true,

  backdrop: "rgba(0,0,0,0.45)",

  allowOutsideClick: false,
  allowEscapeKey: true,
  focusConfirm: false,

  showClass: {
    popup: "animate__animated animate__fadeIn animate__faster",
  },

  hideClass: {
    popup: "animate__animated animate__fadeOut animate__faster",
  },

  heightAuto: false,
  scrollbarPadding: false,
});
