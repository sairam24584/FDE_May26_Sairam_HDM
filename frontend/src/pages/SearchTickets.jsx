import { useState } from "react";
import { ticketsApi, CATEGORIES, PRIORITIES, STATUSES } from "../api";
import TicketTable from "../components/TicketTable";

export default function SearchTickets() {
  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    status: "",
    priority: "",
  });
  const [results, setResults] = useState(null);   // null = not searched yet
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const setField = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Strip empty params so the URL stays clean.
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v && v.toString().trim() !== "")
      );
      const data = await ticketsApi.search(params);
      setResults(data);
    } catch (err) {
      setError(err.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFilters({ keyword: "", category: "", status: "", priority: "" });
    setResults(null);
    setError(null);
  };

  return (
    <>
      <h1 className="page-title">Search & Filter</h1>
      <p className="page-subtitle">Find tickets by keyword, category, status, or priority.</p>

      <form className="card" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-row full">
            <label>Keyword</label>
            <input
              value={filters.keyword}
              onChange={setField("keyword")}
              placeholder="Searches description, employee name, department, resolution notes…"
            />
          </div>

          <div>
            <label>Category</label>
            <select value={filters.category} onChange={setField("category")}>
              <option value="">— Any —</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label>Status</label>
            <select value={filters.status} onChange={setField("status")}>
              <option value="">— Any —</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label>Priority</label>
            <select value={filters.priority} onChange={setField("priority")}>
              <option value="">— Any —</option>
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={reset}>Reset</button>
        </div>
      </form>

      {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

      {results !== null && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Results ({results.length})</h3>
          <TicketTable tickets={results} emptyText="No tickets match those filters." />
        </div>
      )}
    </>
  );
}
