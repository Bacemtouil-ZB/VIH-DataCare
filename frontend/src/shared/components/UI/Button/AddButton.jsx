import React from "react";
import './AddButton.css';

function AddButton({ onClick }) {
  return (
    <button
      type="button"
      id="add-button-sidebar"
      className="add-button w-100"
      onClick={onClick} // tu peux passer une fonction au clic
    >
      <i className="bi bi-plus-lg me-2"></i>
      Nouveau 
    </button>
  );
}

export default AddButton;
