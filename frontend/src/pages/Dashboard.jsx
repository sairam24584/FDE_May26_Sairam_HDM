import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ticketsApi } from "../api";
import TicketTable from "../components/TicketTable";

/**
 * Dashboard: top-level summary stats + recent tickets.
 */
export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ticketsApi
      .list()
      .then(setTickets)
      .catch((err) => setError(err.message || "Failed to load tickets"))
      .finally(() => setLoading(false));
  }, []);

  const total       = tickets.length;
  const open        = tickets.filter((t) => t.status === "Open").length;
  const inProgress  = tickets.filter((t) => t.status === "In Progress").length;
  const resolved    = tickets.filter((t) => t.status === "Resolved").length;
  const critical    = tickets.filter((t) => t.priority === "Critical").length;

  const recent = tickets.slice(0, 5);

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Overview of helpdesk activity.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="empty">Loading…</div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat accent-blue">  <div className="label">Total Tickets</div><div className="value">{total}</div></div>
            <div className="stat accent-amber"> <div className="label">Open</div>         <div className="value">{open}</div></div>
            <div className="stat">              <div className="label">In Progress</div>  <div className="value">{inProgress}</div></div>
            <div className="stat accent-green"> <div className="label">Resolved</div>     <div className="value">{resolved}</div></div>
            <div className="stat accent-red">   <div className="label">Critical</div>     <div className="value">{critical}</div></div>
          </div>

          <div className="card">
            <div className="flex-row" style={{ marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Recent Tickets</h3>
              <span className="spacer" />
              <Link to="/tickets" className="btn btn-secondary">View All</Link>
              <Link to="/tickets/new" className="btn btn-primary">New Ticket</Link>
            </div>
            <TicketTable tickets={recent} emptyText="No tickets yet — create the first one." />
          </div>
        </>
      )}
    </>
  );
}
