import Swal from "sweetalert2";

export const Alert = Swal.mixin({
  customClass: {
    popup: "rounded-4 shadow-lg border-0",
    title: "fw-bold text-dark fs-5",
    htmlContainer: "text-muted",
    confirmButton: "btn btn-danger px-4 py-2 fw-semibold",
    cancelButton: "btn btn-outline-secondary px-4 py-2 fw-semibold",
  },

  buttonsStyling: false,
  reverseButtons: true,

  backdrop: "rgba(0, 0, 0, 0.55)",

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
