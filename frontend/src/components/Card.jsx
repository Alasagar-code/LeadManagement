import React from "react";

export default function Card({ children, style }) {
  const base = {
    background: "white",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };
  return <div style={{ ...base, ...style }}>{children}</div>;
}
