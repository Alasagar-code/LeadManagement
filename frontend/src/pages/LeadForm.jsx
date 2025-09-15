import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import Card from "../components/Card";
import Button from "../components/Button";

export default function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState({ first_name: "", last_name: "", email: "", company: "", city: "", status: "new", score: "", lead_value: "" });

  useEffect(() => {
    if (id) {
      api.get(`/leads/${id}`).then(res => setLead(res.data));
    }
  }, [id]);

  const handleChange = (e) => setLead({ ...lead, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await api.put(`/leads/${id}`, lead);
    else await api.post("/leads", lead);
    navigate("/leads");
  };

  const input = { width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px" };

  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <Card style={{ width: "400px" }}>
        <h2>{id ? "Edit Lead" : "Create Lead"}</h2>
        <form onSubmit={handleSubmit}>
          <input name="first_name" placeholder="First Name" value={lead.first_name} onChange={handleChange} style={input} />
          <input name="last_name" placeholder="Last Name" value={lead.last_name} onChange={handleChange} style={input} />
          <input name="email" type="email" placeholder="Email" value={lead.email} onChange={handleChange} style={input} />
          <input name="company" placeholder="Company" value={lead.company} onChange={handleChange} style={input} />
          <input name="city" placeholder="City" value={lead.city} onChange={handleChange} style={input} />
          <select name="status" value={lead.status} onChange={handleChange} style={input}>
            <option value="new">new</option>
            <option value="contacted">contacted</option>
            <option value="qualified">qualified</option>
            <option value="lost">lost</option>
            <option value="won">won</option>
          </select>
          <input name="score" type="number" placeholder="Score" value={lead.score} onChange={handleChange} style={input} />
          <input name="lead_value" type="number" placeholder="Lead Value" value={lead.lead_value} onChange={handleChange} style={input} />
          <Button type="submit" style={{ width: "100%" }}>{id ? "Update" : "Create"}</Button>
        </form>
      </Card>
    </div>
  );
}
