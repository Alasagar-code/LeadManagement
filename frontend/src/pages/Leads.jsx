// src/pages/Leads.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import api from "../api/api";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Leads() {
  const [rowData, setRowData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([
    { field: "email", operator: "contains", value: "" },
  ]);

  // fetch leads
  const fetchLeads = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const params = { page: p, limit };
        if (statusFilter) params.status = statusFilter;
        if (searchEmail) params.email_contains = searchEmail;
        filters.forEach((f) => {
          if (f.value) {
            params[`${f.field}_${f.operator}`] = f.value;
          }
        });
        const res = await api.get("/leads", { params });
        setRowData(res.data.data);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, searchEmail, filters, limit]
  );

  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);

  // ✅ Actions Cell Renderer with box
  const ActionCellRenderer = (props) => {
    const id = props.data._id;

    const handleDelete = async () => {
      if (!window.confirm("Delete this lead?")) return;
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads(page); // refresh after delete
      } catch {
        alert("Delete failed");
      }
    };

    return (
      <div
        style={{
          display: "flex",
          gap: "8px",
          background: "#f4f4f4",
          padding: "6px 10px",
          borderRadius: "6px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link
          to={`/leads/${id}/edit`}
          style={{
            background: "#3498db",
            color: "white",
            padding: "4px 10px",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          style={{
            background: "#e74c3c",
            color: "white",
            border: "none",
            padding: "4px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        headerName: "Name",
        valueGetter: (p) => `${p.data.first_name} ${p.data.last_name}`,
        sortable: true,
        resizable: true,
      },
      { headerName: "Email", field: "email", sortable: true, resizable: true },
      { headerName: "Company", field: "company", sortable: true, resizable: true },
      { headerName: "City", field: "city", sortable: true },
      { headerName: "Status", field: "status", sortable: true },
      { headerName: "Score", field: "score", sortable: true },
      { headerName: "Value", field: "lead_value", sortable: true },
      {
        headerName: "Actions",
        cellRenderer: (params) => (
          <ActionCellRenderer data={params.data} />
        ),
        pinned: "right",
      },
    ],
    [page]
  );

  // Filter helpers
  const addFilter = () =>
    setFilters([...filters, { field: "email", operator: "contains", value: "" }]);
  const removeFilter = (index) =>
    setFilters(filters.filter((_, i) => i !== index));
  const updateFilter = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  return (
    <div>
      <h2>Leads</h2>
      <div className="filters">
        <input
          placeholder="Search email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All status</option>
          <option value="new">new</option>
          <option value="contacted">contacted</option>
          <option value="qualified">qualified</option>
          <option value="lost">lost</option>
          <option value="won">won</option>
        </select>
        <button className="btn" onClick={() => setShowFilters(!showFilters)}>
          More Filters
        </button>
        <button className="btn" onClick={() => fetchLeads(1)}>
          Apply
        </button>
      </div>

      {showFilters && (
        <div className="card" style={{ margin: "10px 0", padding: "10px" }}>
          {filters.map((filter, index) => (
            <div key={index} className="filter-row" style={{ marginBottom: 6 }}>
              <select
                value={filter.field}
                onChange={(e) => updateFilter(index, "field", e.target.value)}
              >
                <option value="email">Email</option>
                <option value="company">Company</option>
                <option value="city">City</option>
                <option value="status">Status</option>
                <option value="source">Source</option>
                <option value="score">Score</option>
                <option value="lead_value">Lead Value</option>
              </select>
              <select
                value={filter.operator}
                onChange={(e) => updateFilter(index, "operator", e.target.value)}
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="in">In</option>
                <option value="gt">Greater Than</option>
                <option value="lt">Less Than</option>
                <option value="between">Between</option>
              </select>
              <input
                value={filter.value}
                onChange={(e) => updateFilter(index, "value", e.target.value)}
              />
              <button onClick={() => removeFilter(index)}>Remove</button>
            </div>
          ))}
          <button onClick={addFilter}>Add Filter</button>
        </div>
      )}

      <div className="ag-theme-alpine" style={{ height: 520, width: "100%" }}>
        {loading ? (
          <div className="center">
            <div className="spinner"></div>
          </div>
        ) : (
          <AgGridReact
            rowData={rowData}
            columnDefs={columns}
            defaultColDef={{ flex: 1 }}
          />
        )}
      </div>

      <div className="pagination" style={{ marginTop: 12 }}>
        <button
          onClick={() => fetchLeads(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span>
          Page {page} / {totalPages} — Total {total}
        </span>
        <button
          onClick={() => fetchLeads(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <Link to="/leads/new" className="btn">
          Create new lead
        </Link>
      </div>
    </div>
  );
}
