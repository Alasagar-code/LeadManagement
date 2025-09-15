import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Leads from "./pages/Leads";
import LeadForm from "./pages/LeadForm";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {loggedIn && <Navbar onLogout={() => setLoggedIn(false)} />}

      <Routes>
        {!loggedIn && (
          <>
            <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {loggedIn && (
          <>
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/new" element={<LeadForm />} />
            <Route path="/leads/:id/edit" element={<LeadForm />} />
            <Route path="*" element={<Navigate to="/leads" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
