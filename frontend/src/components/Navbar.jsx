import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const styles = {
    nav: {
      background: "#1976d2",
      color: "white",
      padding: "14px 28px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: { fontSize: "20px", fontWeight: "bold" },
    links: { display: "flex", gap: "18px" },
    link: { color: "white", textDecoration: "none", fontWeight: 500, cursor: "pointer" }
  };

  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>Lead Manager</h1>
      <div style={styles.links}>
        <Link to="/leads" style={styles.link}>Leads</Link>
        <span
          style={styles.link}
          onClick={() => {
            onLogout();
            navigate("/login");
          }}
        >
          Logout
        </span>
      </div>
    </nav>
  );
}
