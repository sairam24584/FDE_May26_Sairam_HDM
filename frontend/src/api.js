/**
 * Axios instance + thin API helpers.
 * Centralising here means components never deal with URLs or HTTP directly.
 */
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export const ticketsApi = {
  list:   ()              => http.get("/tickets").then(r => r.data),
  get:    (id)            => http.get(`/tickets/${id}`).then(r => r.data),
  create: (payload)       => http.post("/tickets", payload).then(r => r.data),
  update: (id, payload)   => http.put(`/tickets/${id}`, payload).then(r => r.data),
  remove: (id)            => http.delete(`/tickets/${id}`).then(r => r.data),
  search: (params)        => http.get("/search", { params }).then(r => r.data),
};

// Domain constants — mirrored from backend enums.
export const CATEGORIES = [
  "VPN Issue",
  "Password Reset",
  "Software Installation",
  "Laptop Issue",
  "Email Access",
  "Network Connectivity",
  "Hardware Request",
];
export const PRIORITIES = ["Low", "Medium", "High", "Critical"];
export const STATUSES   = ["Open", "In Progress", "Resolved", "Closed"];
