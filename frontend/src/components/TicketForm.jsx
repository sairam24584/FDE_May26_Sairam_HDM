import { useState, useEffect } from "react";
import { CATEGORIES, PRIORITIES, STATUSES } from "../api";

/**
 * Reusable ticket form used by both Create and Edit screens.
 *
 * Props:
 *   initial       — optional initial values (for edit mode)
 *   onSubmit      — async (values) => void
 *   submitLabel   — button text
 *   showStatus    — whether to expose status + resolution_notes (edit mode)
 */
export default function TicketForm({ initial, onSubmit, submitLabel = "Submit", showStatus = false }) {
  const [values, setValues] = useState({
    employee_name: "",
    department: "",
    issue_category: CATEGORIES[0],
    description: "",
    priority: "Medium",
    status: "Open",
    resolution_notes: "",
    ...initial,
  });

  // If `initial` arrives async (edit page load), reset form.
  useEffect(() => {
    if (initial) setValues((v) => ({ ...v, ...initial }));
  }, [initial]);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!values.employee_name.trim())  e.employee_name = "Employee name is required";
    if (!values.department.trim())     e.department    = "Department is required";
    if (!values.description.trim() || values.description.trim().length < 5)
      e.description = "Description must be at least 5 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { ...values };
      // Strip empty resolution_notes so backend keeps NULL.
      if (!payload.resolution_notes?.trim()) payload.resolution_notes = null;
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div>
          <label htmlFor="employee_name">Employee Name *</label>
          <input id="employee_name" value={values.employee_name} onChange={setField("employee_name")} />
          {errors.employee_name && <div className="field-error">{errors.employee_name}</div>}
        </div>

        <div>
          <label htmlFor="department">Department *</label>
          <input id="department" value={values.department} onChange={setField("department")} />
          {errors.department && <div className="field-error">{errors.department}</div>}
        </div>

        <div>
          <label htmlFor="issue_category">Issue Category *</label>
          <select id="issue_category" value={values.issue_category} onChange={setField("issue_category")}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="priority">Priority *</label>
          <select id="priority" value={values.priority} onChange={setField("priority")}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        {showStatus && (
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" value={values.status} onChange={setField("status")}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}

        <div className="form-row full">
          <label htmlFor="description">Description *</label>
          <textarea id="description" value={values.description} onChange={setField("description")} />
          {errors.description && <div className="field-error">{errors.description}</div>}
        </div>

        {showStatus && (
          <div className="form-row full">
            <label htmlFor="resolution_notes">Resolution Notes</label>
            <textarea
              id="resolution_notes"
              value={values.resolution_notes || ""}
              onChange={setField("resolution_notes")}
              placeholder="What was done to fix the issue?"
            />
          </div>
        )}
      </div>

      <div className="btn-row">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
