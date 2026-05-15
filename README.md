# Helpdesk Ticket Management System (HDMS)

A full-stack web application that lets employees raise internal IT support
tickets and lets a support admin manage and resolve them. Built as **Phase 1**
of the FDE capstone — foundational CRUD + search, designed so later phases
(authentication, analytics, AI/RAG search) can plug in cleanly.

---

## Project Overview

Most organisations still triage IT issues over email and chat, which leads to
duplicate work, missed SLAs, and zero historical visibility. HDMS centralises
this workflow:

- Employees create tickets describing the issue.
- Support admins see every ticket, update status, add resolution notes, and
  search the backlog.
- Every ticket carries category, priority, and status so reporting becomes
  trivial in later phases.

### Features Implemented (Phase 1)

- Ticket CRUD — Create, list, view, update, delete.
- Search & filter by keyword, category, status, and priority.
- Dashboard with summary counters (Total / Open / In Progress / Resolved / Critical).
- Server-side validation against the seven categories, four priorities, and
  four statuses defined in the requirement doc.
- Responsive UI with colour-coded status and priority badges.
- Centralised error handling and CORS configured for the React dev server.
- Seed script with 15 realistic sample tickets so the UI is alive on first run.

### Out of Phase 1 Scope

Authentication, notifications, analytics dashboards, AI/semantic search, and
cloud deployment — these are explicitly deferred per the requirement document.

---

## Technology Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | React 18, React Router, Axios, Vite |
| Backend  | Python 3.10+, FastAPI, SQLAlchemy 2.x, Pydantic v2 |
| Database | SQLite 3 (file-based, zero-setup) |
| Tooling  | Uvicorn, Postman, Git/GitHub |

---

## Repository Structure

```
FDE_May26_Sairam_HDM/
├── backend/
│   ├── main.py             # FastAPI app, CORS, exception handlers
│   ├── database.py         # SQLAlchemy engine + session dependency
│   ├── models.py           # ORM model
│   ├── schemas.py          # Pydantic request/response schemas + enums
│   ├── crud.py             # DB-only service layer
│   ├── routers/
│   │   └── tickets.py      # All /tickets and /search endpoints
│   ├── services/           # (reserved for future business logic)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, TicketForm, TicketTable, Badge
│   │   ├── pages/          # Dashboard, TicketList, CreateTicket, TicketDetails, SearchTickets
│   │   ├── api.js          # Axios instance + helpers + enums
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql          # CREATE TABLE + CHECK constraints + indexes
│   ├── seed.sql            # 15 sample tickets
│   └── init_db.py          # Convenience script: schema + seed
├── docs/
│   ├── API.md              # Endpoint-by-endpoint reference
│   └── HDMS.postman_collection.json
├── screenshots/            # UI / API screenshots
├── requirements.txt        # Root mirror of backend deps
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python **3.10+**
- Node **18+**
- npm **9+**

### 1. Backend — FastAPI

```bash
# (Recommended) create and activate a virtualenv
python -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Initialise the SQLite DB and load 15 sample tickets
python database/init_db.py

# Run the API
cd backend
uvicorn main:app --reload --port 8000
```

The API is now live at <http://localhost:8000> and the interactive Swagger UI
is at <http://localhost:8000/docs>.

### 2. Frontend — React

In a **separate terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app opens at <http://localhost:5173>. The frontend talks to the backend at
`http://localhost:8000` by default; override via `VITE_API_BASE_URL` in
`frontend/.env` if needed.

### 3. Database

SQLite needs no server. The DB file is created at `backend/helpdesk.db` by
`database/init_db.py`. Schema and seed scripts live in `database/` so an
evaluator can also load them by hand:

```bash
sqlite3 backend/helpdesk.db < database/schema.sql
sqlite3 backend/helpdesk.db < database/seed.sql
```

To switch to PostgreSQL later, change `SQLALCHEMY_DATABASE_URL` in
`backend/database.py` to a `postgresql+psycopg://…` URL.

---

## API Details

Full endpoint reference, including request/response examples, is in
[`docs/API.md`](docs/API.md). A ready-to-import Postman collection is in
[`docs/HDMS.postman_collection.json`](docs/HDMS.postman_collection.json).

| Method | Endpoint            | Purpose              |
| ------ | ------------------- | -------------------- |
| GET    | `/tickets`          | List all tickets     |
| GET    | `/tickets/{id}`     | Get one ticket       |
| POST   | `/tickets`          | Create ticket        |
| PUT    | `/tickets/{id}`     | Update ticket        |
| DELETE | `/tickets/{id}`     | Delete ticket        |
| GET    | `/search`           | Keyword + filters    |
| GET    | `/health`           | Health probe         |

### Example: Create a Ticket

```bash
curl -X POST http://localhost:8000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "employee_name": "Sairam Reddy",
    "department": "Engineering",
    "issue_category": "VPN Issue",
    "description": "VPN client crashes on launch.",
    "priority": "High"
  }'
```

Response (`201 Created`):

```json
{
  "ticket_id": 16,
  "employee_name": "Sairam Reddy",
  "department": "Engineering",
  "issue_category": "VPN Issue",
  "description": "VPN client crashes on launch.",
  "priority": "High",
  "status": "Open",
  "resolution_notes": null,
  "created_at": "2026-05-14T10:42:11"
}
```

---

## Domain Reference

**Issue Categories** — VPN Issue, Password Reset, Software Installation,
Laptop Issue, Email Access, Network Connectivity, Hardware Request.

**Priorities** — Low, Medium, High, Critical.

**Statuses** — Open, In Progress, Resolved, Closed.

**Users**

| User Type     | Responsibilities             |
| ------------- | ---------------------------- |
| Employee      | Create and view tickets      |
| Support Admin | Manage and resolve tickets   |

---

## Screenshots

Add the following to `screenshots/` before submission:

- `dashboard.png` — Dashboard with stats and recent tickets
- `create.png` — Create Ticket form
- `list.png` — Ticket listing
- `details.png` — Ticket details view
- `edit.png` — Editing a ticket
- `search.png` — Search with filters applied
- `api-swagger.png` — `/docs` Swagger page
- `postman-create.png` — Postman test of POST `/tickets`

---

## Future Enhancements

The architecture is intentionally modular to support:

- Authentication & role-based access (Employee vs Support Admin)
- Email/Slack notifications on status changes
- Analytics dashboard (tickets by category, MTTR, etc.)
- AI-powered semantic search across resolution notes
- RAG-based support assistant suggesting fixes from past tickets
- Cloud deployment (Docker + AWS/Azure)

---

## License

Educational project — FDE Capstone, Phase 1.
