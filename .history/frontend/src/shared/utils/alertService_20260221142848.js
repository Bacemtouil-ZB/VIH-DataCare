import Swal from "sweetalert2";

// // Instance personnalisée
// export const Alert = Swal.mixin({
//   customClass: {
//     popup: "rounded-4 shadow",
//     title: "fw-bold text-dark",
//     confirmButton: "btn btn-danger px-4",
//     cancelButton: "btn btn-secondary px-4",
//   },
//   buttonsStyling: false,
//   reverseButtons: true,
//   backdrop: `
//     rgba(0,0,0,0.5)
//   `,
// });
import "./alertService.css";
export const Alert = Swal.mixin({
  customClass: {
    popup: "rounded-4 shadow-lg",
    title: "fw-bold",
    confirmButton: "btn btn-custom-confirm px-4",
    cancelButton: "btn btn-custom-cancel px-4",
    icon: "custom-icon",
  },
  buttonsStyling: false,
  reverseButtons: true,
});
