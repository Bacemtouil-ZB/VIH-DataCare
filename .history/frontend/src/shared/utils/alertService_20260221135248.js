import Swal from "sweetalert2";

export const Alert = Swal.mixin({
  customClass: {
    popup: "rounded-4 shadow-lg border-0 p-3",
    title: "fw-bold fs-5 text-dark",
    htmlContainer: "text-muted small",
    actions: "d-flex gap-3 justify-content-end mt-4", // 🔥 espace entre boutons
    confirmButton: "btn btn-app-primary px-4 py-2 fw-semibold",
    cancelButton: "btn btn-app-outline px-4 py-2 fw-semibold",
  },

  buttonsStyling: false,
  reverseButtons: true,

  backdrop: "rgba(0,0,0,0.55)",

  allowOutsideClick: false,
  allowEscapeKey: true,
  focusConfirm: false,

  showClass: {
    popup: "animate__animated animate__fadeInDown animate__faster",
  },

  hideClass: {
    popup: "animate__animated animate__fadeOutUp animate__faster",
  },

  heightAuto: false,
  scrollbarPadding: false,
});
