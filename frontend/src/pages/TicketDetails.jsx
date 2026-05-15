import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ticketsApi } from "../api";
import { StatusBadge, PriorityBadge } from "../components/Badge";
import TicketForm from "../components/TicketForm";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const t = await ticketsApi.get(id);
      setTicket(t);
    } catch (err) {
      setError(err.response?.status === 404 ? "Ticket not found." : "Failed to load ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleUpdate = async (payload) => {
    setError(null);
    try {
      const updated = await ticketsApi.update(id, payload);
      setTicket(updated);
      setEditing(false);
      setSuccess("Ticket updated.");
      setTimeout(() => setSuccess(null), 2500);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Update failed.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ticket #${id}? This cannot be undone.`)) return;
    try {
      await ticketsApi.remove(id);
      navigate("/tickets");
    } catch {
      setError("Delete failed.");
    }
  };

  if (loading) return <div className="empty">Loading…</div>;
  if (error && !ticket) return (
    <>
      <div className="alert alert-error">{error}</div>
      <Link to="/tickets" className="btn btn-secondary">Back to list</Link>
    </>
  );

  return (
    <>
      <div className="flex-row">
        <h1 className="page-title" style={{ margin: 0 }}>Ticket #{ticket.ticket_id}</h1>
        <span className="spacer" />
        <Link to="/tickets" className="btn btn-secondary">Back</Link>
        {!editing && <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit</button>}
        {!editing && <button className="btn btn-danger" onClick={handleDelete}>Delete</button>}
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      {editing ? (
        <TicketForm
          initial={{
            employee_name: ticket.employee_name,
            department: ticket.department,
            issue_category: ticket.issue_category,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            resolution_notes: ticket.resolution_notes || "",
          }}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
          showStatus
        />
      ) : (
        <div className="card">
          <Row label="Employee">    {ticket.employee_name}</Row>
          <Row label="Department">  {ticket.department}</Row>
          <Row label="Category">    {ticket.issue_category}</Row>
          <Row label="Priority">    <PriorityBadge value={ticket.priority} /></Row>
          <Row label="Status">      <StatusBadge value={ticket.status} /></Row>
          <Row label="Created">     {new Date(ticket.created_at).toLocaleString()}</Row>
          <Row label="Description"><div style={{ whiteSpace: "pre-wrap" }}>{ticket.description}</div></Row>
          <Row label="Resolution Notes">
            {ticket.resolution_notes
              ? <div style={{ whiteSpace: "pre-wrap" }}>{ticket.resolution_notes}</div>
              : <span className="muted">—</span>}
          </Row>
        </div>
      )}
    </>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <div className="muted">{label}</div>
      <div>{children}</div>
    </div>
  );
}
