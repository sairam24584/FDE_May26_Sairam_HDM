import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) => (isActive ? "active" : "");
  return (
    <header className="navbar">
      <div className="brand">HDMS</div>
      <nav>
        <NavLink to="/"            className={linkClass} end>Dashboard</NavLink>
        <NavLink to="/tickets"     className={linkClass}>Tickets</NavLink>
        <NavLink to="/tickets/new" className={linkClass}>New Ticket</NavLink>
        <NavLink to="/search"      className={linkClass}>Search</NavLink>
      </nav>
    </header>
  );
}
