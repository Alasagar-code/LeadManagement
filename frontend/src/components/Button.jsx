import React from "react";

export default function Button({ children, onClick, disabled, type = "button", style }) {
  const base = {
    padding: "8px 14px",
    background: disabled ? "#ccc" : "#1976d2",
    color: "white",
    fontSize: "14px",
    fontWeight: 500,
    border: "none",
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 0.2s",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...style }}
    >
      {children}
    </button>
  );
}
