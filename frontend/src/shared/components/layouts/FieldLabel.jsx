import React from "react";
import { Form } from "react-bootstrap";

export default function FieldLabel({ children, required = false, className = "" }) {
  return (
    <Form.Label
      className={`fw-bold text-uppercase text-secondary mb-1 ${className}`}
      style={{ fontSize: "0.7rem" }}
    >
      {children}
      {required && (
        <span style={{ color: "#dc3545", fontWeight: 800 }}>
          {" "}*
        </span>
      )}
    </Form.Label>
  );
}