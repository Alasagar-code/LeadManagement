import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch {
      setError("Registration failed");
    }
  };

  const wrapper = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(to right, #bbdefb, #e3f2fd)",
  };
  const title = { textAlign: "center", marginBottom: "20px", color: "#1976d2" };
  const input = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px"
  };
  const errorMsg = { color: "red", marginBottom: "10px", fontSize: "14px" };

  return (
    <div style={wrapper}>
      <Card style={{ width: "320px" }}>
        <h2 style={title}>Register</h2>
        {error && <p style={errorMsg}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            style={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            style={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" style={{ width: "100%" }}>Register</Button>
        </form>
        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "14px" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#1976d2", cursor: "pointer", fontWeight: 500 }}
          >
            Login
          </span>
        </p>
      </Card>
    </div>
  );
}
