import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ticketsApi } from "../api";
import TicketTable from "../components/TicketTable";

export default function TicketList() {
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

  return (
    <>
      <div className="flex-row">
        <h1 className="page-title" style={{ margin: 0 }}>All Tickets</h1>
        <span className="spacer" />
        <Link to="/tickets/new" className="btn btn-primary">+ New Ticket</Link>
      </div>
      <p className="page-subtitle">{tickets.length} total</p>

      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        {loading ? <div className="empty">Loading…</div> : <TicketTable tickets={tickets} />}
      </div>
    </>
  );
}
