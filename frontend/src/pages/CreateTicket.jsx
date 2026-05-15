import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi } from "../api";
import TicketForm from "../components/TicketForm";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const submit = async (payload) => {
    setError(null);
    try {
      const created = await ticketsApi.create(payload);
      navigate(`/tickets/${created.ticket_id}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to create ticket. Check your inputs.");
    }
  };

  return (
    <>
      <h1 className="page-title">Create New Ticket</h1>
      <p className="page-subtitle">Submit a new helpdesk request.</p>
      {error && <div className="alert alert-error">{error}</div>}
      <TicketForm onSubmit={submit} submitLabel="Create Ticket" />
    </>
  );
}
