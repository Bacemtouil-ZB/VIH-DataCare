import React from "react";
import { Form } from "react-bootstrap";
export default function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  label = "",
  inputClassName = "",
  wrapperClassName = "",
  type = "text",          
}) {
  return (
    <div className={`mb-3 ${wrapperClassName}`}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        type={type}        
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`sh-searchbar-input ${inputClassName}`}
      />
    </div>
  );
}