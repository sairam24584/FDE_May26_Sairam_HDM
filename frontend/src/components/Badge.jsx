/**
 * Color-coded badge for status and priority.
 */
const statusClass = {
  "Open":         "b-open",
  "In Progress":  "b-progress",
  "Resolved":     "b-resolved",
  "Closed":       "b-closed",
};
const priorityClass = {
  "Low":      "b-low",
  "Medium":   "b-medium",
  "High":     "b-high",
  "Critical": "b-critical",
};

export function StatusBadge({ value }) {
  return <span className={`badge ${statusClass[value] || ""}`}>{value}</span>;
}

export function PriorityBadge({ value }) {
  return <span className={`badge ${priorityClass[value] || ""}`}>{value}</span>;
}
