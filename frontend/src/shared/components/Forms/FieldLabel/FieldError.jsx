import React from "react";

export default function FieldError({ error, className = "" }) {
  if (!error) return null;

  return (
    <span className={`text-danger d-block mt-1 ${className}`} style={{ fontSize: "0.75rem" }}>
      {error}
    </span>
  );
}