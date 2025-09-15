import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");       // controlled input
  const [password, setPassword] = useState(""); // controlled input
  const [error, setError] = useState("");       // error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.status === 200) {
        onLogin();             // update loggedIn state in App.jsx
        navigate("/leads");    // go to leads page
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials, please try again."
      );
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
    fontSize: "14px",
  };
  const errorMsg = { color: "red", marginBottom: "10px", fontSize: "14px" };

  return (
    <div style={wrapper}>
      <Card style={{ width: "320px" }}>
        <h2 style={title}>Login</h2>
        {error && <p style={errorMsg}>{error}</p>}

        <form onSubmit={handleSubmit}>
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
          <Button type="submit" style={{ width: "100%" }}>
            Sign In
          </Button>
        </form>

        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ color: "#1976d2", cursor: "pointer", fontWeight: 500 }}
          >
            Register
          </span>
        </p>
      </Card>
    </div>
  );
}
