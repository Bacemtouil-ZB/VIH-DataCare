import Swal from "sweetalert2";

export const Alert = Swal.mixin({
  customClass: {
    popup: "app-alert-compact rounded-3 shadow border-0",
    title: "app-alert-title",
    htmlContainer: "app-alert-text",
    actions: "app-alert-actions",
    confirmButton: "btn btn-app-primary app-alert-btn",
    cancelButton: "btn btn-app-outline app-alert-btn",
  },

  width: 420, // 🔥 largeur réduite (default ~500px)

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
