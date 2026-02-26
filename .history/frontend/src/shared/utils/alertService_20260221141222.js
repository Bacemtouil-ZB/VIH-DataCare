import Swal from "sweetalert2";

/* === Injection CSS minimal et professionnel === */
const injectAlertStyles = () => {
  if (document.getElementById("app-alert-styles")) return;

  const style = document.createElement("style");
  style.id = "app-alert-styles";

  style.innerHTML = `
    .swal2-popup {
      border-radius: 14px !important;
      padding: 1.5rem !important;
      font-family: 'Inter', sans-serif;
    }

    .swal2-title {
      font-size: 1.1rem !important;
      font-weight: 600;
    }

    .swal2-html-container {
      font-size: 0.92rem !important;
      color: #6b7280;
    }

    .swal2-actions {
      gap: 0.8rem !important;
    }

    .swal2-confirm,
    .swal2-cancel {
      border-radius: 8px !important;
      padding: 0.45rem 1.2rem !important;
      font-size: 0.85rem !important;
      font-weight: 500 !important;
    }

    .swal2-icon {
      transform: scale(0.9);
    }
  `;

  document.head.appendChild(style);
};

if (typeof window !== "undefined") {
  injectAlertStyles();
}

/* === Instance Professionnelle === */

export const Alert = Swal.mixin({
  width: 420,

  confirmButtonColor: "#2563eb", // Primary color
  cancelButtonColor: "#6c757d", // Secondary color

  reverseButtons: true,
  buttonsStyling: true,

  backdrop: "rgba(0,0,0,0.45)",

  allowOutsideClick: false,
  allowEscapeKey: true,
  focusConfirm: false,

  showClass: {
    popup: "swal2-show",
  },

  hideClass: {
    popup: "swal2-hide",
  },
});
