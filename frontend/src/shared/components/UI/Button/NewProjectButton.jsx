import React from "react";
import './NewProjectButton.css';

function NewProjectButton({ onClick }) {
  return (
    <button
      type="button"
      id="new-project-button-sidebar"
      className="new-project-button w-100"
      onClick={onClick} // tu peux passer une fonction au clic
    >
      <i className="bi bi-plus-lg me-2"></i>
      Nouveau projet
    </button>
  );
}

export default NewProjectButton;
