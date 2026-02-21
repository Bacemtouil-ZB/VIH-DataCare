import Swal from "sweetalert2";
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
