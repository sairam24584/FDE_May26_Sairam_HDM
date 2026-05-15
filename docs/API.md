# HDMS — API Documentation

Base URL (local): `http://localhost:8000`

All requests and responses use JSON. The interactive Swagger UI at
`/docs` exposes the same surface and lets you try requests in-browser.

---

## Data Model

### Ticket

| Field              | Type     | Notes                                                        |
| ------------------ | -------- | ------------------------------------------------------------ |
| `ticket_id`        | integer  | Server-assigned, auto-increment                              |
| `employee_name`    | string   | 1–120 chars, required                                        |
| `department`       | string   | 1–80 chars, required                                         |
| `issue_category`   | enum     | See Categories below                                         |
| `description`      | string   | ≥ 5 chars, required                                          |
| `priority`         | enum     | `Low` / `Medium` / `High` / `Critical`                       |
| `status`           | enum     | `Open` / `In Progress` / `Resolved` / `Closed` (default Open) |
| `resolution_notes` | string?  | Optional                                                     |
| `created_at`       | datetime | ISO 8601, server-assigned                                    |

**Categories**: `VPN Issue`, `Password Reset`, `Software Installation`,
`Laptop Issue`, `Email Access`, `Network Connectivity`, `Hardware Request`.

---

## Endpoints

### `GET /tickets`

List all tickets, newest first.

**Response 200**
```json
[
  {
    "ticket_id": 6,
    "employee_name": "Ananya Pillai",
    "department": "Engineering",
    "issue_category": "Network Connectivity",
    "description": "Wi-Fi disconnects every ~10 minutes on 4th floor.",
    "priority": "Critical",
    "status": "Open",
    "resolution_notes": null,
    "created_at": "2026-05-13T15:25:00"
  }
]
```

---

### `GET /tickets/{id}`

Fetch a single ticket.

**Response 200** — `Ticket` object (see above).

**Response 404**
```json
{ "detail": "Ticket 42 not found" }
```

---

### `POST /tickets`

Create a new ticket.

**Request**
```json
{
  "employee_name": "Sairam Reddy",
  "department": "Engineering",
  "issue_category": "VPN Issue",
  "description": "VPN client crashes on launch.",
  "priority": "High"
}
```

`status` defaults to `Open`. `resolution_notes` is optional.

**Response 201** — the created ticket including `ticket_id` and `created_at`.

**Response 422** — validation failure.
```json
{
  "detail": "Validation failed",
  "errors": [
    {
      "type": "enum",
      "loc": ["body", "issue_category"],
      "msg": "Input should be 'VPN Issue', 'Password Reset', ...",
      "input": "Other"
    }
  ]
}
```

---

### `PUT /tickets/{id}`

Partial update — send only fields you want to change.

**Request**
```json
{
  "status": "In Progress",
  "resolution_notes": "Reassigned to network team."
}
```

**Response 200** — the updated ticket.
**Response 404** — if the id doesn't exist.

---

### `DELETE /tickets/{id}`

**Response 200**
```json
{ "message": "Ticket 5 deleted successfully" }
```
**Response 404** — if the id doesn't exist.

---

### `GET /search`

Combined keyword search + filters. All parameters are optional and ANDed.

| Query param | Type     | Example                  |
| ----------- | -------- | ------------------------ |
| `keyword`   | string   | `VPN`                    |
| `category`  | enum     | `VPN Issue`              |
| `status`    | enum     | `Open`                   |
| `priority`  | enum     | `Critical`               |

`keyword` matches against `description`, `employee_name`, `department`, and
`resolution_notes` (case-insensitive).

**Examples**

```
GET /search?keyword=password
GET /search?status=Open&priority=Critical
GET /search?category=VPN%20Issue&status=In%20Progress
```

**Response 200** — array of `Ticket` objects (possibly empty).

---

### `GET /health`

```json
{ "status": "ok" }
```

---

## Status Codes

| Code | Meaning                                         |
| ---- | ----------------------------------------------- |
| 200  | OK                                              |
| 201  | Created (POST `/tickets`)                       |
| 404  | Ticket not found                                |
| 422  | Validation failed (bad enum, missing fields)    |
| 500  | Server / database error                         |

---

## Error Envelope

All non-2xx responses follow:
```json
{ "detail": "<human-readable message>" }
```
For validation errors, an additional `errors` array carries field-level
details (matching FastAPI's default format).
