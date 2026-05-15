import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import SearchTickets from "./pages/SearchTickets";

export default function App() {
  return (
    <div className="layout">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/"              element={<Dashboard />} />
          <Route path="/tickets"       element={<TicketList />} />
          <Route path="/tickets/new"   element={<CreateTicket />} />
          <Route path="/tickets/:id"   element={<TicketDetails />} />
          <Route path="/search"        element={<SearchTickets />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
