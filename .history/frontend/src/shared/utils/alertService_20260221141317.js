import Swal from "sweetalert2";

/* === CSS intégré optimisé pour fond blanc === */
const injectAlertStyles = () => {
  if (document.getElementById("app-alert-styles")) return;

  const style = document.createElement("style");
  style.id = "app-alert-styles";

  style.innerHTML = `
    .swal2-popup {
      background: #ffffff !important;
      border-radius: 16px !important;
      padding: 1.6rem !important;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12) !important;
      border: 1px solid #f1f1f1;
      font-family: 'Inter', sans-serif;
    }

    .swal2-title {
      font-size: 1.15rem !important;
      font-weight: 600;
      color: #1f2937 !important;
    }

    .swal2-html-container {
      font-size: 0.92rem !important;
      color: #6b7280;
      margin-top: 0.3rem;
    }

    .swal2-actions {
      gap: 0.8rem !important;
      margin-top: 1.4rem !important;
    }

    .swal2-confirm,
    .swal2-cancel {
      border-radius: 10px !important;
      padding: 0.5rem 1.3rem !important;
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

/* === Instance PRO === */

export const Alert = Swal.mixin({
  width: 430,

  confirmButtonColor: "#2563eb", // bleu professionnel
  cancelButtonColor: "#e5e7eb", // gris clair

  reverseButtons: true,
  buttonsStyling: true,

  backdrop: "rgba(0,0,0,0.35)", // 🔥 plus léger pour fond blanc

  allowOutsideClick: false,
  allowEscapeKey: true,
  focusConfirm: false,
});
