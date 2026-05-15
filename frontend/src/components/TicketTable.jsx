import { Link } from "react-router-dom";
import { StatusBadge, PriorityBadge } from "./Badge";

export default function TicketTable({ tickets, emptyText = "No tickets to show." }) {
  if (!tickets || tickets.length === 0) {
    return <div className="empty">{emptyText}</div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Department</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.ticket_id}>
              <td>#{t.ticket_id}</td>
              <td>{t.employee_name}</td>
              <td>{t.department}</td>
              <td>{t.issue_category}</td>
              <td><PriorityBadge value={t.priority} /></td>
              <td><StatusBadge value={t.status} /></td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td><Link to={`/tickets/${t.ticket_id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
