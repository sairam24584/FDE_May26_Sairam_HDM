-- =====================================================================
--  Helpdesk Ticket Management System (HDMS) — Database Schema
--  Database: SQLite 3
--  Phase 1 scope: single `tickets` table per project requirement doc.
-- =====================================================================

DROP TABLE IF EXISTS tickets;

CREATE TABLE tickets (
    ticket_id        INTEGER  PRIMARY KEY AUTOINCREMENT,
    employee_name    TEXT     NOT NULL,
    department       TEXT     NOT NULL,
    issue_category   TEXT     NOT NULL
                              CHECK (issue_category IN (
                                  'VPN Issue',
                                  'Password Reset',
                                  'Software Installation',
                                  'Laptop Issue',
                                  'Email Access',
                                  'Network Connectivity',
                                  'Hardware Request'
                              )),
    description      TEXT     NOT NULL,
    priority         TEXT     NOT NULL
                              CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status           TEXT     NOT NULL DEFAULT 'Open'
                              CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    resolution_notes TEXT,
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Helpful indexes for the search/filter endpoint.
CREATE INDEX idx_tickets_status   ON tickets(status);
CREATE INDEX idx_tickets_category ON tickets(issue_category);
CREATE INDEX idx_tickets_priority ON tickets(priority);
